// lib/phonepe/payment.js
import {
    MetaInfo,
    StandardCheckoutPayRequest,
    CreateSdkOrderRequest
} from "pg-sdk-node";
import { RefundRequest } from "pg-sdk-node";
import { phonepeClient } from "./client";

// -----------------------------------------
// 1. Create Payment (Redirect flow)
// -----------------------------------------
export async function createPhonePeOrder({
    orderId,
    amount,
    redirectUrl,
    meta = {}
}) {
    try {
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
        return { success: false, message: error.message };
    }
}

// -----------------------------------------
// 2. Check Order Status
// -----------------------------------------
export async function checkPhonePeStatus(orderId) {
    try {
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
        return { success: false, message: error.message };
    }
}

// -----------------------------------------
// 3. Validate Callback Signature
// -----------------------------------------
export async function validatePhonePeCallback({
    username,
    password,
    authorization,
    responseBodyString
}) {
    try {
        const result = phonepeClient.validateCallback(
            username,
            password,
            authorization,
            responseBodyString
        );

        return { success: true, data: result };
    } catch (error) {
        console.error("❌ Callback Validation Error:", error);
        return { success: false, message: error.message };
    }
}

// -----------------------------------------
// 4. Refund Payment (optional)
// -----------------------------------------

export async function refundPhonePeOrder({
    refundId,
    merchantOrderId,
    amount
}) {
    try {
        const request = RefundRequest.builder()
            .amount(amount)
            .merchantRefundId(refundId)
            .originalMerchantOrderId(merchantOrderId)
            .build();

        const response = await phonepeClient.refund(request);

        return { success: true, data: response };
    } catch (error) {
        console.error("❌ Refund Error:", error);
        return { success: false, message: error.message };
    }
}
