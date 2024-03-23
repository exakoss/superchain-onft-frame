import { TransactionTargetResponse } from "frames.js";
import { getFrameMessage } from "frames.js/next/server";
import { NextRequest, NextResponse } from "next/server";
import {
  Abi,
  encodeFunctionData,
} from "viem";
import { omniGawsAbi } from "../../constants/omniGaws";

export async function POST(
  req: NextRequest
): Promise<NextResponse<TransactionTargetResponse>> {
  const json = await req.json();

  const frameMessage = await getFrameMessage(json);

  if (!frameMessage) {
    throw new Error("No frame message");
  }

  const calldata = encodeFunctionData({
    abi: omniGawsAbi,
    functionName: "mint",
    args: [1], 
  });

  return NextResponse.json({
    chainId: "eip155:7777777", // Zora 7777777
    method: "eth_sendTransaction",
    params: {
      abi: omniGawsAbi as Abi,
      to: "0x87f7F414e2fF3d8B051cf0Fb3ebD3d7811435EbE",
      data: calldata,
      value: '330000000000000',
    },
  });
}