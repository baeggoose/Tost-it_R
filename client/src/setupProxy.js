const { createProxyMiddleware } = require("http-proxy-middleware");
const { baseURL } = require("./utils/apiConfig");

module.exports = function (app) {
  app.use(
    "/api",
    createProxyMiddleware({
      target: baseURL,
      changeOrigin: true,
    })
  );

  // 클라이언트 라우팅을 위한 설정
  app.use((req, res, next) => {
    if (req.method === "GET" && !req.url.startsWith("/api")) {
      return res.sendFile(path.resolve(__dirname, "public", "index.html"));
    }
    next();
  });
};
