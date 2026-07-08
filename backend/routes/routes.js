import express from "express";

const router = express.Router();

router.post("/webhook", (req, res) => {

    console.log("Webhook received");

    res.sendStatus(200);
    if (event.type === "checkout.session.completed") {

    const session = event.data.object;

    console.log(session);
}

});

export default router;