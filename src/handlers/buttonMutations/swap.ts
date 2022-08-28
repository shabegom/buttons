import { ButtonCache, SwapCache } from "src/types";
import Buttons from "src/main";
import { createOnclick } from "../../handlers";

//TODO: test swapMutation
function swapMutation(plugin: Buttons, button: ButtonCache): () => void {
  let currentSwap = plugin.swapCache.find(
    (swap: SwapCache) => swap.id === button.id
  );
  if (!currentSwap) {
    currentSwap = plugin.addToSwapCache(button);
  }
  const returnFunction = () => createOnclick(plugin, currentSwap.currentButton);
  plugin.updateSwapCache(currentSwap);
  return returnFunction;
}

export default swapMutation;
