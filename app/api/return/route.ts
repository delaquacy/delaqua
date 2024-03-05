export async function POST(req: any, res: any) {
  try {
    // Предполагается, что тело запроса уже распарсено Next.js автоматически
    const eventData = req.body;

    console.log("Received webhook event:", eventData);
    // Используйте методы Next.js для отправки статуса и ответа
    return res.status(200).json({ message: "Данные получены" });
  } catch (error) {
    console.log("Ошибка при обработке запроса:", error);
    // Обязательно отправляйте HTTP-ответ в блоке catch, чтобы избежать ошибок о том, что ответ не был возвращен
    return res
      .status(500)
      .json({ error: "Внутренняя ошибка сервера" });
  }
}
