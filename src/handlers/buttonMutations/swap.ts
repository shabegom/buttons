import { ButtonCache, SwapCache } from "src/types";
import Buttons from "src/main";
import { createOnclick } from "../../handlers";

//TODO: test swapMutation
function swapMutation(plugin: Buttons, button: ButtonCache): () => void {
  let currentSwap = findCurrentSwapButton(button, plugin);
  if (!currentSwap) {
    setTimeout(() => {
      currentSwap = findCurrentSwapButton(button, plugin);
    }, 1000);
  }
  if (currentSwap) {
    const onclickFunctions = currentSwap.buttons.map((button) => {
      return createOnclick(plugin, button);
    });
    const returnFunction = () => {
      const currentSwap = findCurrentSwapButton(button, plugin);
      const currentButton = currentSwap.currentButtonIndex;
      onclickFunctions[currentButton]();
      plugin.updateSwapCache(currentSwap);
    };
    return returnFunction;
  }
}

const getSwapButton = (cache: SwapCache[], id: string) => {
  return cache.find((button) => button.id === id);
};

const findCurrentSwapButton = (button: ButtonCache, plugin: Buttons) => {
  let currentSwap = getSwapButton(plugin.swapCache, button.id);
  if (!currentSwap) {
    plugin.addToSwapCache(button);
    currentSwap = getSwapButton(plugin.swapCache, button.id);
  }
  if (currentSwap) {
    return currentSwap;
  }
};

export default swapMutation;
