export declare enum MathErrorCode {
    MultiplicationOverflow = "MultiplicationOverflow",
    MulDivOverflow = "MulDivOverflow",
    MultiplicationShiftRightOverflow = "MultiplicationShiftRightOverflow",
    DivideByZero = "DivideByZero"
}
export declare enum TokenErrorCode {
    TokenMaxExceeded = "TokenMaxExceeded",
    TokenMinSubceeded = "TokenMinSubceeded"
}
export declare enum SwapErrorCode {
    InvalidDevFeePercentage = "InvalidDevFeePercentage",
    InvalidSqrtPriceLimitDirection = "InvalidSqrtPriceLimitDirection",
    SqrtPriceOutOfBounds = "SqrtPriceOutOfBounds",
    ZeroTradableAmount = "ZeroTradableAmount",
    AmountOutBelowMinimum = "AmountOutBelowMinimum",
    AmountInAboveMaximum = "AmountInAboveMaximum",
    TickArrayCrossingAboveMax = "TickArrayCrossingAboveMax",
    TickArrayIndexNotInitialized = "TickArrayIndexNotInitialized",
    TickArraySequenceInvalid = "TickArraySequenceInvalid"
}
export declare enum RouteQueryErrorCode {
    RouteDoesNotExist = "RouteDoesNotExist",
    TradeAmountTooHigh = "TradeAmountTooHigh",
    ZeroInputAmount = "ZeroInputAmount",
    General = "General"
}
export type YevefisErrorCode = TokenErrorCode | SwapErrorCode | MathErrorCode | RouteQueryErrorCode;
export declare class YevefisError extends Error {
    message: string;
    errorCode?: YevefisErrorCode;
    constructor(message: string, errorCode?: YevefisErrorCode, stack?: string);
    static isYevefisErrorCode(e: any, code: YevefisErrorCode): boolean;
}
