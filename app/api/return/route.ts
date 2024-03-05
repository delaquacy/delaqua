export async function POST(req: any, res: any) {
  try {
    const eventData = await req.json();

    console.log("Received webhook event:", eventData);
    res.status(200).send("Данные получены");
  } catch (error) {
    console.log("Ошибка при обработке запроса:", error);
  }
}
