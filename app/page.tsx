import { getTokenUrl } from "frames.js";
import {
  FrameButton,
  FrameContainer,
  FrameImage,
  FrameReducer,
  NextServerPageProps,
  getPreviousFrame,
  useFramesReducer,
  getFrameMessage
} from "frames.js/next/server";
import Link from "next/link";
import { zora, base } from "viem/chains";
import { currentURL } from "./utils";
import { createDebugUrl, DEFAULT_DEBUGGER_HUB_URL } from "./debug";

type State = {
  pageIndex: number;
};

const nfts: {
  src: string;
  tokenUrl: string;
}[] = [
  {
    src: "https://kpc25ao2zkvks64suf3b4fyxqkt4gnjpcap4cdjg3fdjp5h4kl6q.arweave.net/U8WugdrKqql7kqF2HhcXgqfDNS8QH8ENJtlGl_T8Uv0/2.gif",
    tokenUrl: getTokenUrl({
      address: "0x87f7F414e2fF3d8B051cf0Fb3ebD3d7811435EbE",
      chain: base,
    }),
  },
  {
    src: "https://kpc25ao2zkvks64suf3b4fyxqkt4gnjpcap4cdjg3fdjp5h4kl6q.arweave.net/U8WugdrKqql7kqF2HhcXgqfDNS8QH8ENJtlGl_T8Uv0/4.gif",
    tokenUrl: getTokenUrl({
      address: "0x87f7F414e2fF3d8B051cf0Fb3ebD3d7811435EbE",
      chain: zora,
    }),
  },
];

const initialState: State = { pageIndex: 0 };

//Change pageIndex on the first button click
const reducer: FrameReducer<State> = (state, action) => {
  const buttonIndex = action.postBody?.untrustedData.buttonIndex;

  return {
    // pageIndex: (state.pageIndex === 0 && buttonIndex === 1) ? 1 : 0
    pageIndex: (state.pageIndex === 0) ? 1 : 0
  };
};

// This is a react server component only
export default async function Home({ searchParams }: NextServerPageProps) {
  const url = currentURL("/");
  const previousFrame = getPreviousFrame<State>(searchParams);
  const [state] = useFramesReducer<State>(reducer, initialState, previousFrame);

  const frameMessage = await getFrameMessage(previousFrame.postBody, {
    hubHttpUrl: DEFAULT_DEBUGGER_HUB_URL,
  });

  const currentChain = (state.pageIndex === 0) ? 'Mint on Base' : ' Mint on Zora'
  const nextChain = (state.pageIndex === 0) ? 'Switch to Zora' : 'Switch to Base'
  const txTarget = (state.pageIndex === 0) ? '/txdatabase' : '/txdatazora'
  const scanTarget = (state.pageIndex === 1) ? `https://basescan.org/tx/${frameMessage?.transactionId}` : `https://zorascan.xyz/tx/${frameMessage?.transactionId}`

  //If there was a mint transaction, return a screen with a hash and block explorer link
  if (frameMessage?.transactionId) {
    return (
      <FrameContainer
        pathname="/"
        postUrl="/frames"
        state={state}
        previousFrame={previousFrame}
      >
        <FrameImage aspectRatio="1:1">
          <div tw="bg-black text-white w-full h-full justify-center items-center flex font-large flex-col">
              Thank you for minting OmniGaws! 😈💜
          </div>
        </FrameImage>
        <FrameButton>Go back🔙</FrameButton>
        <FrameButton
          action="link"
          target={scanTarget}
        >
          View on block explorer
        </FrameButton>
        <FrameButton
          action="link"
          target={`https://omni-x.io/drops`}
        >
          More on Omni X
        </FrameButton>
      </FrameContainer>
    );
  }

  return (
    <div>
      Superchain ONFT Mint <Link href={createDebugUrl(url)}>Debug</Link>
      <FrameContainer
        pathname="/"
        postUrl="/frames"
        state={state}
        previousFrame={previousFrame}
      >
        <FrameImage
          src={nfts[state.pageIndex]!.src}
          aspectRatio="1:1"
        ></FrameImage>
        <FrameButton>{nextChain}</FrameButton>
        <FrameButton action="tx" target={txTarget}>
          {currentChain}
        </FrameButton>
      </FrameContainer>
    </div>
  );
}
