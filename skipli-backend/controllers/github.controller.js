const admin = require("firebase-admin");
const axios = require("axios");
const db = admin.firestore();
const querystring = require("querystring");

exports.redirectToGitHubOAuth = (req, res) => {
  const clientId = process.env.GITHUB_CLIENT_ID;

  if (!clientId) {
    return res
      .status(500)
      .json({
        error: "Missing GitHub client ID",
      });
  }

  const params = querystring.stringify({
    client_id: clientId,
    scope: "user:email",
  });

  const githubAuthUrl = `https://github.com/login/oauth/authorize?${params}`;
  res.redirect(githubAuthUrl);
};

exports.handleGitHubOAuthCallback = async (
  req,
  res
) => {
  const code = req.query.code;
  const clientId = process.env.GITHUB_CLIENT_ID;
  const clientSecret =
    process.env.GITHUB_CLIENT_SECRET;

  if (!code || !clientId || !clientSecret) {
    return res
      .status(400)
      .json({
        error:
          "Missing code or client credentials",
      });
  }

  try {
    const response = await axios.post(
      `https://github.com/login/oauth/access_token`,
      {
        client_id: clientId,
        client_secret: clientSecret,
        code: code,
      },
      {
        headers: {
          Accept: "application/json",
        },
      }
    );

    const { access_token } = response.data;

    if (!access_token) {
      return res
        .status(400)
        .json({
          error:
            "GitHub access token not received",
        });
    }

    const userInfo = await axios.get(
      "https://api.github.com/user",
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
          Accept: "application/json",
        },
      }
    );

    res.status(200).json({
      accessToken: access_token,
      user: userInfo.data,
    });
  } catch (error) {
    res.status(500).json({
      error: "GitHub OAuth failed",
      detail: error.message,
    });
  }
};


// 1. GET /repositories/:repositoryId/github-info
exports.getGitHubInfo = async (req, res) => {
  try {
    const { repositoryId } = req.params;

    const headers = {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      Accept: "application/vnd.github+json",
    };

    const baseUrl = `https://api.github.com/repos/${repositoryId}`;

    const [branches, pulls, issues, commits] =
      await Promise.all([
        axios.get(`${baseUrl}/branches`, {
          headers,
        }),
        axios.get(`${baseUrl}/pulls`, {
          headers,
        }),
        axios.get(`${baseUrl}/issues`, {
          headers,
        }),
        axios.get(`${baseUrl}/commits`, {
          headers,
        }),
      ]);

    res.status(200).json({
      repositoryId,
      branches: branches.data.map((b) => ({
        name: b.name,
        lastCommitSha: b.commit.sha,
      })),
      pulls: pulls.data.map((p) => ({
        title: p.title,
        pullNumber: p.number,
      })),
      issues: issues.data
        .filter((i) => !i.pull_request) // exclude PRs in issues
        .map((i) => ({
          title: i.title,
          issueNumber: i.number,
        })),
      commits: commits.data.map((c) => ({
        sha: c.sha,
        message: c.commit.message,
      })),
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch GitHub data",
      detail:
        error.response?.data || error.message,
    });
  }
};

// 2. POST /boards/:boardId/cards/:cardId/tasks/:taskId/github-attach
exports.attachGitHubItem = async (req, res) => {
  try {
    const { boardId, cardId, taskId } =
      req.params;
    const { type, number } = req.body;

    if (
      ![
        "pull_request",
        "commit",
        "issue",
      ].includes(type)
    ) {
      return res
        .status(400)
        .json({
          error: "Invalid attachment type",
        });
    }

    const attachment = {
      type,
      number,
      createdAt: new Date().toISOString(),
    };

    const ref = await db
      .collection("cards")
      .doc(cardId)
      .collection("tasks")
      .doc(taskId)
      .collection("githubAttachments")
      .add(attachment);

    res.status(201).json({
      taskId,
      attachmentId: ref.id,
      ...attachment,
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to attach GitHub item",
      detail: error.message,
    });
  }
};

// 3. GET /boards/:boardId/cards/:cardId/tasks/:taskId/github-attachments
exports.getGitHubAttachments = async (
  req,
  res
) => {
  try {
    const { cardId, taskId } = req.params;

    const snapshot = await db
      .collection("cards")
      .doc(cardId)
      .collection("tasks")
      .doc(taskId)
      .collection("githubAttachments")
      .get();

    const attachments = snapshot.docs.map(
      (doc) => ({
        attachmentId: doc.id,
        ...doc.data(),
      })
    );

    res.status(200).json(attachments);
  } catch (error) {
    res.status(500).json({
      error:
        "Failed to fetch GitHub attachments",
      detail: error.message,
    });
  }
};

// 4. DELETE /boards/:boardId/cards/:cardId/tasks/:taskId/github-attachments/:attachmentId
exports.removeGitHubAttachment = async (
  req,
  res
) => {
  try {
    const { cardId, taskId, attachmentId } =
      req.params;

    await db
      .collection("cards")
      .doc(cardId)
      .collection("tasks")
      .doc(taskId)
      .collection("githubAttachments")
      .doc(attachmentId)
      .delete();

    res.status(204).send();
  } catch (error) {
    res.status(500).json({
      error:
        "Failed to delete GitHub attachment",
      detail: error.message,
    });
  }
};
