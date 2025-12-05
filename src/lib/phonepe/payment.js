// lib/phonepe/payment.js

import {
    MetaInfo,
    StandardCheckoutPayRequest
} from "pg-sdk-node";
import { RefundRequest } from "pg-sdk-node";
import { getPhonePeClient } from "./client";

// --------------------------------------------------
// 1. Create Payment (Redirect Checkout Flow)
// --------------------------------------------------
export async function createPhonePeOrder({ orderId, amount, redirectUrl, meta = {} }) {
    try {
        const phonepeClient = getPhonePeClient(); // SAFE INIT (No build errors)

        const metaInfo = MetaInfo.builder()
            .udf1(meta.name || "")
            .udf2(meta.email || "")
            .udf3(meta.phone || "")
            .udf4(meta.note || "")
            .udf5(JSON.stringify(meta.extra || {}))
            .build();

        const request = StandardCheckoutPayRequest.builder()
            .merchantOrderId(orderId)
            .amount(amount)
            .redirectUrl(redirectUrl)
            .metaInfo(metaInfo)
            .build();

        const response = await phonepeClient.pay(request);

        return {
            success: true,
            redirectUrl: response.redirectUrl,
            phonepeOrderId: response.orderId,
            expireAt: response.expireAt,
            state: response.state
        };
    } catch (error) {
        console.error("❌ PhonePe Create Order Error:", error);
        return {
            success: false,
            message: error.message || "Failed to create PhonePe order."
        };
    }
}

// --------------------------------------------------
// 2. Check Payment Status from PhonePe
// --------------------------------------------------
export async function checkPhonePeStatus(orderId) {
    try {
        const phonepeClient = getPhonePeClient(); // SAFE INIT

        const response = await phonepeClient.getOrderStatus(orderId);

        return {
            success: true,
            state: response.state,
            amount: response.amount,
            metaInfo: response.metaInfo,
            paymentDetails: response.paymentDetails,
            raw: response
        };
    } catch (error) {
        console.error("❌ PhonePe Status Check Error:", error);
        return {
            success: false,
            message: error.message || "Failed to fetch payment status."
        };
    }
}

// --------------------------------------------------
// 3. Validate PhonePe Callback (Webhook)
// --------------------------------------------------
export async function validatePhonePeCallback({
    username,
    password,
    authorization,
    responseBodyString
}) {
    try {
        const phonepeClient = getPhonePeClient(); // SAFE INIT

        const result = phonepeClient.validateCallback(
            username,
            password,
            authorization,
            responseBodyString
        );

        return { success: true, data: result };
    } catch (error) {
        console.error("❌ PhonePe Callback Validation Error:", error);
        return {
            success: false,
            message: error.message || "Callback signature validation failed."
        };
    }
}

// --------------------------------------------------
// 4. Refund Payment (PhonePe Refund API)
// --------------------------------------------------
export async function refundPhonePeOrder({ refundId, merchantOrderId, amount }) {
    try {
        const phonepeClient = getPhonePeClient(); // SAFE INIT

        const request = RefundRequest.builder()
            .amount(amount)
            .merchantRefundId(refundId)
            .originalMerchantOrderId(merchantOrderId)
            .build();

        const response = await phonepeClient.refund(request);

        return { success: true, data: response };
    } catch (error) {
        console.error("❌ PhonePe Refund Error:", error);
        return {
            success: false,
            message: error.message || "Refund request failed."
        };
    }
}
