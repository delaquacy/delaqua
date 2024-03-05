export async function POST(req: any, res: any) {
  const eventData = req.body;
  console.log("Received webhook event:", eventData);

  res.status(200).json({ message: "Event received" });
}
