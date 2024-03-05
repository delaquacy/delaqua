// middleware.js
export function middleware(request) {
  console.log("Request:", request.nextUrl.pathname);
  // Вы можете добавить логику для изменения ответа или запроса здесь
}
