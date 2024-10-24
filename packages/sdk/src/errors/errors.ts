export enum MathErrorCode {
	MultiplicationOverflow = "MultiplicationOverflow",
	MulDivOverflow = "MulDivOverflow",
	MultiplicationShiftRightOverflow = "MultiplicationShiftRightOverflow",
	DivideByZero = "DivideByZero",
}

export enum TokenErrorCode {
	TokenMaxExceeded = "TokenMaxExceeded",
	TokenMinSubceeded = "TokenMinSubceeded",
}

export enum SwapErrorCode {
	InvalidDevFeePercentage = "InvalidDevFeePercentage",
	InvalidSqrtPriceLimitDirection = "InvalidSqrtPriceLimitDirection",
	SqrtPriceOutOfBounds = "SqrtPriceOutOfBounds",
	ZeroTradableAmount = "ZeroTradableAmount",
	AmountOutBelowMinimum = "AmountOutBelowMinimum",
	AmountInAboveMaximum = "AmountInAboveMaximum",
	TickArrayCrossingAboveMax = "TickArrayCrossingAboveMax",
	TickArrayIndexNotInitialized = "TickArrayIndexNotInitialized",
	TickArraySequenceInvalid = "TickArraySequenceInvalid",
}

export enum RouteQueryErrorCode {
	RouteDoesNotExist = "RouteDoesNotExist",
	TradeAmountTooHigh = "TradeAmountTooHigh",
	ZeroInputAmount = "ZeroInputAmount",
	General = "General",
}

export type YevefisErrorCode =
	| TokenErrorCode
	| SwapErrorCode
	| MathErrorCode
	| RouteQueryErrorCode;

export class YevefisError extends Error {
	message: string;
	errorCode?: YevefisErrorCode;
	constructor(message: string, errorCode?: YevefisErrorCode, stack?: string) {
		super(message);
		this.message = message;
		this.errorCode = errorCode;
		this.stack = stack;
	}

	public static isYevefisErrorCode(
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		e: any,
		code: YevefisErrorCode,
	): boolean {
		return e instanceof YevefisError && e.errorCode === code;
	}
}
