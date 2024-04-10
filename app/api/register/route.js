const admin = require("../../../firebaseAdmin");

export async function POST(req, res) {
  const body = await req.json();

  const { phoneNumber } = body;
  console.log(phoneNumber);
  try {
    const userRecord = await admin.auth().createUser({
      phoneNumber,
    });

    return res.json({ uid: userRecord.uid });
  } catch (error) {
    console.error("Ошибка создания пользователя:", error);
    return res.json({ error: error.message });
  }
}
