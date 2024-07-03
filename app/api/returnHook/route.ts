import { db } from "@/app/lib/config";
import axios from "axios";
import {
  arrayUnion,
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import type { NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";

const link = process.env.NEXT_PUBLIC_PAYMENT_SHEET_LINK as string;

export async function POST(req: NextRequest, res: NextApiResponse<string>) {
  // Get the current timestamp and format it
  const now = new Date();
  now.setHours(now.getHours() + 3); // Adjust to your timezone
  const formattedDateTime = now
    .toISOString()
    .replace("T", " ")
    .substring(0, 19);

  try {
    // Parse the incoming JSON data from the request body
    const eventData = await req.json();

    // Define the valid event types that trigger actions
    const tableEvents = [
      "ORDER_COMPLETED",
      "ORDER_CANCELLED",
      "ORDER_PAYMENT_DECLINED",
      "ORDER_PAYMENT_FAILED",
    ];

    // If the received event is in the list of valid events, proceed
    if (tableEvents.includes(eventData.event)) {
      // Prepare data for posting to an external service (if needed)
      const postData = {
        event: eventData.event,
        order_id: eventData.order_id,
        date_time: formattedDateTime,
      };

      // Example of posting data to an external service (not shown in detail here)
      await axios.post(link, postData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    // Query Firestore to find all documents in 'allOrders' collection with matching 'paymentId'
    const allOrdersQuery = query(
      collection(db, "allOrders"),
      where("paymentId", "==", eventData.order_id)
    );

    // Get the query snapshot containing documents that match the query
    const querySnapshot = await getDocs(allOrdersQuery);

    // Update the 'paymentStatus' in the 'payments' collection document
    const paymentRef = doc(db, `payments/${eventData.order_id}`);
    await updateDoc(paymentRef, {
      paymentStatus: arrayUnion(eventData.event),
    });

    // Iterate over each document in the query snapshot and update its 'paymentStatus'
    querySnapshot.forEach(async (doc) => {
      const orderRef = doc.ref; // Reference to the Firestore document

      await updateDoc(orderRef, {
        paymentStatus: arrayUnion(eventData.event),
      });

      // Extract the userId from the order document (assuming the field exists)
      const userId = doc.data().userId;

      if (userId) {
        // Query the 'users/{userId}/orders' collection to find matching documents
        const userOrdersQuery = query(
          collection(db, `users/${userId}/orders`),
          where("orderId", "==", eventData.order_id)
        );

        // Get the query snapshot containing documents that match the query
        const userOrdersSnapshot = await getDocs(userOrdersQuery);

        // Iterate over each document in the query snapshot and update its 'paymentStatus'
        userOrdersSnapshot.forEach(async (userOrderDoc) => {
          const userOrderRef = userOrderDoc.ref; // Reference to the Firestore document
          await updateDoc(userOrderRef, {
            paymentStatus: arrayUnion(eventData.event),
          });
        });
      }
    });

    // Respond with a success message
    const response = NextResponse.json(
      {
        message: "Success",
      },
      {
        status: 200,
      }
    );

    return response;
  } catch (error) {
    // Handle errors that occur during processing
    console.log("Error handling request:", error);
  }
}
