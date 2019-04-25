import React from "react";
import styled from "styled-components";
import BreadcrumbBar from "@/containers/Breadcrumb/Breadcrumb";
import {notification} from "antd";
import axios from "axios";
import _ from "lodash";
import {} from "./CrowdsaleHistoryList";
import {CrowdsaleHistoryList} from "./CrowdsaleHistoryList";
import {CrowdsaleTransactions} from "./CrowdsaleTransactions";
import LayoutWrapper from "@ui/utility/layoutWrapper.js";
import "./CrowdSaleHistory.scss"

function initState() {
  return {
    isLoading: false,
    selectedTokenId: "1234567891011121314151617188182882",
    groupedTransactions: {},
    tokens: []
  };
}

const testData = [
  {
    ID: 1,
    TokenID: "1234567891011121314151617188182882",
    TokenName: "TokenName1",
    TokenImage:
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAlgAAAEsCAYAAAAfPc2WAAATPklEQVR4Xu3dTauVdRvG4b+kmIQIgYEhSIQ6FWpgElHhF3CiBjmLoEywQSFGjS2JXqEEoUEQTfwCCmn5EaJhhak4CQfqQMqXuBdseWKro/t82HEeeyh6sa/jWoMfa917u+ratWt3hy8CBAgQIECAAIHZBFYJrNksDSJAgAABAgQILAQElhcCAQIECBAgQGBmAYE1M6hxBAgQIECAAAGB5TVAgAABAgQIEJhZQGDNDGocAQIECBAgQEBgeQ0QIECAAAECBGYWEFgzgxpHgAABAgQIEBBYXgMECBAgQIAAgZkFBNbMoMYRIECAAAECBASW1wABAgQIECBAYGYBgTUzqHEECBAgQIAAAYHlNUCAAAECBAgQmFlAYM0MahwBAgQIECBAQGB5DRAgQIAAAQIEZhYQWDODGkeAAAECBAgQEFheAwQIECBAgACBmQUE1sygxhEgQIAAAQIEBJbXAAECBAgQIEBgZgGBNTOocQQIECBAgAABgeU1QIAAAQIECBCYWUBgzQxqHAECBAgQIEBAYHkNECBAgAABAgRmFhBYM4MaR4AAAQIECBAQWF4DBAgQIECAAIGZBf4vgfXnn3+OW7dujY0bN45HHnlk2Qp//fXXuHr16r/+fM2aNePxxx8fq1atmnll4wgQIECAAAECWYF4YF25cmUcPHhwscWBAwfGnj17lm30448/js8+++y+m27ZsmW88cYbY9u2bVkJ0wkQIECAAAECMwnEA+vzzz8f586dW3y70ztSJ0+efGBgrVu3bjz//PPj7t274/fffx8XLlxYvPM1vYv15Zdfjk2bNs20tjEECBAgQIAAgZxANLBu3749XnnllUUwPfnkk+PixYvj2LFjy96NWnoH66mnnhoff/zxv7Z97bXXFh8f7t69e7z55ps5CZMJECBAgAABAjMJRAPrhx9+WLzz9Nxzz41du3Yt4umZZ54Z77333r++/YcF1tdffz1Onz49Xn755fHWW2/NtLYxBAgQIECAAIGcQDSwDh06NC5fvjyOHz8+pnenpnezpo/8vvvuu7F27dp7Wz0osH777bdx5MiRxb/55JNPxvQ8li8CBAgQIECAwEoXiAXW0sPtGzZsGN98883CYYqk8+fPL3vYfSmwpp8wfOKJJxZ/9/r16+PGjRtj9erV4/Dhw4t3wHwRIECAAAECBP4LArHA+uKLL8bZs2fH3r17x/79+xcW00Prb7/99rKH3f/3pwgfffTRxd/9+++/x/QM1/SA+wsvvDCmZ7Eee+yx/4Kp75EAAQIECBAoF4gE1tLD7dNHe1NQrV+//h7zRx99NG7evDk+/PDDsXXr1sWf3+8jwunB+J9//nmcOHFiTO+GvfTSS2P6yNEXAQIECBAgQGClC0QCa+nh9oct/+yzz46jR48+MLCW/u0vv/wy3n///TG9szU9u+WLAAECBAgQILDSBSKBtfRw+4svvrjswfQ7d+6Mb7/9dvHR39LD7g/7KcLpo8J9+/Yt/v6pU6dWuqfvjwABAgQIECAwZg+spYfbpwfWv//++/v+1zjvvPPO+PXXX+897P6wwPrqq6/GmTNnHvhLSt2QAAECBAgQILDSBGYPrKWH23fu3Dnefffd++77008/jU8//fReNC0F1vSrG7Zv3774N9P/T3jp0qXFTxJOXx988MHYsWPHSvPz/RAgQIAAAQIElgnMHljTx3nTx3rT7756+umn70s+fUz46quvLh52n3756B9//HHf/4twCq7NmzeP119//d4D8W5IgAABAgQIEFjpArMH1kpf2PdHgAABAgQIEEgLCKy0sPkECBAgQIBAnYDAqju5hQkQIECAAIG0gMBKC5tPgAABAgQI1AkIrLqTW5gAAQIECBBICwistLD5BAgQIECAQJ2AwKo7uYUJECBAgACBtIDASgubT4AAAQIECNQJCKy6k1uYAAECBAgQSAsIrLSw+QQIECBAgECdgMCqO7mFCRAgQIAAgbSAwEoLm0+AAAECBAjUCQisupNbmAABAgQIEEgLCKy0sPkECBAgQIBAnYDAqju5hQkQIECAAIG0gMBKC5tPgAABAgQI1AkIrLqTW5gAAQIECBBICwistLD5BAgQIECAQJ2AwKo7uYUJECBAgACBtIDASgubT4AAAQIECNQJCKy6k1uYAAECBAgQSAsIrLSw+QQIECBAgECdgMCqO7mFCRAgQIAAgbSAwEoLm0+AAAECBAjUCQisupNbmAABAgQIEEgLCKy0sPkECBAgQIBAnYDAqju5hQkQIECAAIG0gMBKC5tPgAABAgQI1AkIrLqTW5gAAQIECBBICwistLD5BAgQIECAQJ2AwKo7uYUJECBAgACBtIDA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AAECBAjUCQisupNbmAABAgQIEEgLCKy0sPkECBAgQIBAnYDAqju5hQkQIECAAIG0gMBKC5tPgAABAgQI1AkIrLqTW5gAAQIECBBICwistLD5BAgQIECAQJ2AwKo7uYUJECBAgACBtIDASgubT4AAAQIECNQJCKy6k1uYAAECBAgQSAsIrLSw+QQIECBAgECdgMCqO7mFCRAgQIAAgbSAwEoLm0+AAAECBAjUCQisupNbmAABAgQIEEgLCKy0sPkECBAgQIBAnYDAqju5hQkQIECAAIG0gMBKC5tPgAABAgQI1AkIrLqTW5gAAQIECBBICwistLD5BAgQIECAQJ2AwKo7uYUJECBAgACBtIDASgubT4AAAQIECNQJCKy6k1uYAAECBAgQSAsIrLSw+QQIECBAgECdgMCqO7mFCRAgQIAAgbSAwEoLm0+AAAECBAjUCQisupNbmAABAgQIEEgLCKy0sPkECBAgQIBAnYDAqju5hQkQIECAAIG0gMBKC5tPgAABAgQI1AkIrLqTW5gAAQIECBBICwistLD5BAgQIECAQJ2AwKo7uYUJECBAgACBtIDASgubT4AAAQIECNQJCKy6k1uYAAECBAgQSAv8A6wTuhRPAwzSAAAAAElFTkSuQmCC",
    TxID: "1234567",
    Side: "Buy",
    Amount: 1,
    PriceLimit: 1
  },
  {
    ID: 2,
    TokenID: "1234567891011121314151617188182882",
    TokenName: "TokenName1",
    TokenImage:
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAlgAAAEsCAYAAAAfPc2WAAATPklEQVR4Xu3dTauVdRvG4b+kmIQIgYEhSIQ6FWpgElHhF3CiBjmLoEywQSFGjS2JXqEEoUEQTfwCCmn5EaJhhak4CQfqQMqXuBdseWKro/t82HEeeyh6sa/jWoMfa917u+ratWt3hy8CBAgQIECAAIHZBFYJrNksDSJAgAABAgQILAQElhcCAQIECBAgQGBmAYE1M6hxBAgQIECAAAGB5TVAgAABAgQIEJhZQGDNDGocAQIECBAgQEBgeQ0QIECAAAECBGYWEFgzgxpHgAABAgQIEBBYXgMECBAgQIAAgZkFBNbMoMYRIECAAAECBASW1wABAgQIECBAYGYBgTUzqHEECBAgQIAAAYHlNUCAAAECBAgQmFlAYM0MahwBAgQIECBAQGB5DRAgQIAAAQIEZhYQWDODGkeAAAECBAgQEFheAwQIECBAgACBmQUE1sygxhEgQIAAAQIEBJbXAAECBAgQIEBgZgGBNTOocQQIECBAgAABgeU1QIAAAQIECBCYWUBgzQxqHAECBAgQIEBAYHkNECBAgAABAgRmFhBYM4MaR4AAAQIECBAQWF4DBAgQIECAAIGZBf4vgfXnn3+OW7dujY0bN45HHnlk2Qp//fXXuHr16r/+fM2aNePxxx8fq1atmnll4wgQIECAAAECWYF4YF25cmUcPHhwscWBAwfGnj17lm30448/js8+++y+m27ZsmW88cYbY9u2bVkJ0wkQIECAAAECMwnEA+vzzz8f586dW3y70ztSJ0+efGBgrVu3bjz//PPj7t274/fffx8XLlxYvPM1vYv15Zdfjk2bNs20tjEECBAgQIAAgZxANLBu3749XnnllUUwPfnkk+PixYvj2LFjy96NWnoH66mnnhoff/zxv7Z97bXXFh8f7t69e7z55ps5CZMJECBAgAABAjMJRAPrhx9+WLzz9Nxzz41du3Yt4umZZ54Z77333r++/YcF1tdffz1Onz49Xn755fHWW2/NtLYxBAgQIECAAIGcQDSwDh06NC5fvjyOHz8+pnenpnezpo/8vvvuu7F27dp7Wz0osH777bdx5MiRxb/55JNPxvQ8li8CBAgQIECAwEoXiAXW0sPtGzZsGN98883CYYqk8+fPL3vYfSmwpp8wfOKJJxZ/9/r16+PGjRtj9erV4/Dhw4t3wHwRIECAAAECBP4LArHA+uKLL8bZs2fH3r17x/79+xcW00Prb7/99rKH3f/3pwgfffTRxd/9+++/x/QM1/SA+wsvvDCmZ7Eee+yx/4Kp75EAAQIECBAoF4gE1tLD7dNHe1NQrV+//h7zRx99NG7evDk+/PDDsXXr1sWf3+8jwunB+J9//nmcOHFiTO+GvfTSS2P6yNEXAQIECBAgQGClC0QCa+nh9oct/+yzz46jR48+MLCW/u0vv/wy3n///TG9szU9u+WLAAECBAgQILDSBSKBtfRw+4svvrjswfQ7d+6Mb7/9dvHR39LD7g/7KcLpo8J9+/Yt/v6pU6dWuqfvjwABAgQIECAwZg+spYfbpwfWv//++/v+1zjvvPPO+PXXX+897P6wwPrqq6/GmTNnHvhLSt2QAAECBAgQILDSBGYPrKWH23fu3Dnefffd++77008/jU8//fReNC0F1vSrG7Zv3774N9P/T3jp0qXFTxJOXx988MHYsWPHSvPz/RAgQIAAAQIElgnMHljTx3nTx3rT7756+umn70s+fUz46quvLh52n3756B9//HHf/4twCq7NmzeP119//d4D8W5IgAABAgQIEFjpArMH1kpf2PdHgAABAgQIEEgLCKy0sPkECBAgQIBAnYDAqju5hQkQIECAAIG0gMBKC5tPgAABAgQI1AkIrLqTW5gAAQIECBBICwistLD5BAgQIECAQJ2AwKo7uYUJECBAgACBtIDASgubT4AAAQIECNQJCKy6k1uYAAECBAgQSAsIrLSw+QQIECBAgECdgMCqO7mFCRAgQIAAgbSAwEoLm0+AAAECBAjUCQisupNbmAABAgQIEEgLCKy0sPkECBAgQIBAnYDAqju5hQkQIECAAIG0gMBKC5tPgAABAgQI1AkIrLqTW5gAAQIECBBICwistLD5BAgQIECAQJ2AwKo7uYUJECBAgACBtIDASgubT4AAAQIECNQJCKy6k1uYAAECBAgQSAsIrLSw+QQIECBAgECdgMCqO7mFCRAgQIAAgbSAwEoLm0+AAAECBAjUCQisupNbmAABAgQIEEgLCKy0sPkECBAgQIBAnYDAqju5hQkQIECAAIG0gMBKC5tPgAABAgQI1AkIrLqTW5gAAQIECBBICwistLD5BAgQIECAQJ2AwKo7uYUJECBAgACBtIDA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AAECBAjUCQisupNbmAABAgQIEEgLCKy0sPkECBAgQIBAnYDAqju5hQkQIECAAIG0gMBKC5tPgAABAgQI1AkIrLqTW5gAAQIECBBICwistLD5BAgQIECAQJ2AwKo7uYUJECBAgACBtIDASgubT4AAAQIECNQJCKy6k1uYAAECBAgQSAsIrLSw+QQIECBAgECdgMCqO7mFCRAgQIAAgbSAwEoLm0+AAAECBAjUCQisupNbmAABAgQIEEgLCKy0sPkECBAgQIBAnYDAqju5hQkQIECAAIG0gMBKC5tPgAABAgQI1AkIrLqTW5gAAQIECBBICwistLD5BAgQIECAQJ2AwKo7uYUJECBAgACBtIDASgubT4AAAQIECNQJCKy6k1uYAAECBAgQSAsIrLSw+QQIECBAgECdgMCqO7mFCRAgQIAAgbSAwEoLm0+AAAECBAjUCQisupNbmAABAgQIEEgLCKy0sPkECBAgQIBAnYDAqju5hQkQIECAAIG0gMBKC5tPgAABAgQI1AkIrLqTW5gAAQIECBBICwistLD5BAgQIECAQJ2AwKo7uYUJECBAgACBtIDASgubT4AAAQIECNQJCKy6k1uYAAECBAgQSAv8A6wTuhRPAwzSAAAAAElFTkSuQmCC",
    TxID: "1234567",
    Side: "Buy",
    Amount: 1,
    PriceLimit: 1
  },
  {
    ID: 3,
    TokenID: "2362836298793475934759834769348798345",
    TokenName: "TokenName2",
    TokenImage:
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAlgAAAEsCAYAAAAfPc2WAAATPklEQVR4Xu3dTauVdRvG4b+kmIQIgYEhSIQ6FWpgElHhF3CiBjmLoEywQSFGjS2JXqEEoUEQTfwCCmn5EaJhhak4CQfqQMqXuBdseWKro/t82HEeeyh6sa/jWoMfa917u+ratWt3hy8CBAgQIECAAIHZBFYJrNksDSJAgAABAgQILAQElhcCAQIECBAgQGBmAYE1M6hxBAgQIECAAAGB5TVAgAABAgQIEJhZQGDNDGocAQIECBAgQEBgeQ0QIECAAAECBGYWEFgzgxpHgAABAgQIEBBYXgMECBAgQIAAgZkFBNbMoMYRIECAAAECBASW1wABAgQIECBAYGYBgTUzqHEECBAgQIAAAYHlNUCAAAECBAgQmFlAYM0MahwBAgQIECBAQGB5DRAgQIAAAQIEZhYQWDODGkeAAAECBAgQEFheAwQIECBAgACBmQUE1sygxhEgQIAAAQIEBJbXAAECBAgQIEBgZgGBNTOocQQIECBAgAABgeU1QIAAAQIECBCYWUBgzQxqHAECBAgQIEBAYHkNECBAgAABAgRmFhBYM4MaR4AAAQIECBAQWF4DBAgQIECAAIGZBf4vgfXnn3+OW7dujY0bN45HHnlk2Qp//fXXuHr16r/+fM2aNePxxx8fq1atmnll4wgQIECAAAECWYF4YF25cmUcPHhwscWBAwfGnj17lm30448/js8+++y+m27ZsmW88cYbY9u2bVkJ0wkQIECAAAECMwnEA+vzzz8f586dW3y70ztSJ0+efGBgrVu3bjz//PPj7t274/fffx8XLlxYvPM1vYv15Zdfjk2bNs20tjEECBAgQIAAgZxANLBu3749XnnllUUwPfnkk+PixYvj2LFjy96NWnoH66mnnhoff/zxv7Z97bXXFh8f7t69e7z55ps5CZMJECBAgAABAjMJRAPrhx9+WLzz9Nxzz41du3Yt4umZZ54Z77333r++/YcF1tdffz1Onz49Xn755fHWW2/NtLYxBAgQIECAAIGcQDSwDh06NC5fvjyOHz8+pnenpnezpo/8vvvuu7F27dp7Wz0osH777bdx5MiRxb/55JNPxvQ8li8CBAgQIECAwEoXiAXW0sPtGzZsGN98883CYYqk8+fPL3vYfSmwpp8wfOKJJxZ/9/r16+PGjRtj9erV4/Dhw4t3wHwRIECAAAECBP4LArHA+uKLL8bZs2fH3r17x/79+xcW00Prb7/99rKH3f/3pwgfffTRxd/9+++/x/QM1/SA+wsvvDCmZ7Eee+yx/4Kp75EAAQIECBAoF4gE1tLD7dNHe1NQrV+//h7zRx99NG7evDk+/PDDsXXr1sWf3+8jwunB+J9//nmcOHFiTO+GvfTSS2P6yNEXAQIECBAgQGClC0QCa+nh9oct/+yzz46jR48+MLCW/u0vv/wy3n///TG9szU9u+WLAAECBAgQILDSBSKBtfRw+4svvrjswfQ7d+6Mb7/9dvHR39LD7g/7KcLpo8J9+/Yt/v6pU6dWuqfvjwABAgQIECAwZg+spYfbpwfWv//++/v+1zjvvPPO+PXXX+897P6wwPrqq6/GmTNnHvhLSt2QAAECBAgQILDSBGYPrKWH23fu3Dnefffd++77008/jU8//fReNC0F1vSrG7Zv3774N9P/T3jp0qXFTxJOXx988MHYsWPHSvPz/RAgQIAAAQIElgnMHljTx3nTx3rT7756+umn70s+fUz46quvLh52n3756B9//HHf/4twCq7NmzeP119//d4D8W5IgAABAgQIEFjpArMH1kpf2PdHgAABAgQIEEgLCKy0sPkECBAgQIBAnYDAqju5hQkQIECAAIG0gMBKC5tPgAABAgQI1AkIrLqTW5gAAQIECBBICwistLD5BAgQIECAQJ2AwKo7uYUJECBAgACBtIDASgubT4AAAQIECNQJCKy6k1uYAAECBAgQSAsIrLSw+QQIECBAgECdgMCqO7mFCRAgQIAAgbSAwEoLm0+AAAECBAjUCQisupNbmAABAgQIEEgLCKy0sPkECBAgQIBAnYDAqju5hQkQIECAAIG0gMBKC5tPgAABAgQI1AkIrLqTW5gAAQIECBBICwistLD5BAgQIECAQJ2AwKo7uYUJECBAgACBtIDASgubT4AAAQIECNQJCKy6k1uYAAECBAgQSAsIrLSw+QQIECBAgECdgMCqO7mFCRAgQIAAgbSAwEoLm0+AAAECBAjUCQisupNbmAABAgQIEEgLCKy0sPkECBAgQIBAnYDAqju5hQkQIECAAIG0gMBKC5tPgAABAgQI1AkIrLqTW5gAAQIECBBICwistLD5BAgQIECAQJ2AwKo7uYUJECBAgACBtIDASgubT4AAAQIECNQJCKy6k1uYAAECBAgQSAsIrLSw+QQIECBAgECdgMCqO7mFCRAgQIAAgbSAwEoLm0+AAAECBAjUCQisupNbmAABAgQIEEgLCKy0sPkECBAgQIBAnYDAqju5hQkQIECAAIG0gMBKC5tPgAABAgQI1AkIrLqTW5gAAQIECBBICwistLD5BAgQIECAQJ2AwKo7uYUJECBAgACBtIDASgubT4AAAQIECNQJCKy6k1uYAAECBAgQSAsIrLSw+QQIECBAgECdgMCqO7mFCRAgQIAAgbSAwEoLm0+AAAECBAjUCQisupNbmAABAgQIEEgLCKy0sPkECBAgQIBAnYDAqju5hQkQIECAAIG0gMBKC5tPgAABAgQI1AkIrLqTW5gAAQIECBBICwistLD5BAgQIECAQJ2AwKo7uYUJECBAgACBtIDASgubT4AAAQIECNQJCKy6k1uYAAECBAgQSAsIrLSw+QQIECBAgECdgMCqO7mFCRAgQIAAgbSAwEoLm0+AAAECBAjUCQisupNbmAABAgQIEEgLCKy0sPkECBAgQIBAnYDAqju5hQkQIECAAIG0gMBKC5tPgAABAgQI1AkIrLqTW5gAAQIECBBICwistLD5BAgQIECAQJ2AwKo7uYUJECBAgACBtIDASgubT4AAAQIECNQJCKy6k1uYAAECBAgQSAsIrLSw+QQIECBAgECdgMCqO7mFCRAgQIAAgbSAwEoLm0+AAAECBAjUCQisupNbmAABAgQIEEgLCKy0sPkECBAgQIBAnYDAqju5hQkQIECAAIG0gMBKC5tPgAABAgQI1AkIrLqTW5gAAQIECBBICwistLD5BAgQIECAQJ2AwKo7uYUJECBAgACBtIDASgubT4AAAQIECNQJCKy6k1uYAAECBAgQSAsIrLSw+QQIECBAgECdgMCqO7mFCRAgQIAAgbSAwEoLm0+AAAECBAjUCQisupNbmAABAgQIEEgLCKy0sPkECBAgQIBAnYDAqju5hQkQIECAAIG0gMBKC5tPgAABAgQI1AkIrLqTW5gAAQIECBBICwistLD5BAgQIECAQJ2AwKo7uYUJECBAgACBtIDASgubT4AAAQIECNQJCKy6k1uYAAECBAgQSAsIrLSw+QQIECBAgECdgMCqO7mFCRAgQIAAgbSAwEoLm0+AAAECBAjUCQisupNbmAABAgQIEEgLCKy0sPkECBAgQIBAnYDAqju5hQkQIECAAIG0gMBKC5tPgAABAgQI1AkIrLqTW5gAAQIECBBICwistLD5BAgQIECAQJ2AwKo7uYUJECBAgACBtIDASgubT4AAAQIECNQJCKy6k1uYAAECBAgQSAsIrLSw+QQIECBAgECdgMCqO7mFCRAgQIAAgbSAwEoLm0+AAAECBAjUCQisupNbmAABAgQIEEgLCKy0sPkECBAgQIBAnYDAqju5hQkQIECAAIG0gMBKC5tPgAABAgQI1AkIrLqTW5gAAQIECBBICwistLD5BAgQIECAQJ2AwKo7uYUJECBAgACBtIDASgubT4AAAQIECNQJCKy6k1uYAAECBAgQSAsIrLSw+QQIECBAgECdgMCqO7mFCRAgQIAAgbSAwEoLm0+AAAECBAjUCQisupNbmAABAgQIEEgLCKy0sPkECBAgQIBAnYDAqju5hQkQIECAAIG0gMBKC5tPgAABAgQI1AkIrLqTW5gAAQIECBBICwistLD5BAgQIECAQJ2AwKo7uYUJECBAgACBtIDASgubT4AAAQIECNQJCKy6k1uYAAECBAgQSAsIrLSw+QQIECBAgECdgMCqO7mFCRAgQIAAgbSAwEoLm0+AAAECBAjUCQisupNbmAABAgQIEEgLCKy0sPkECBAgQIBAnYDAqju5hQkQIECAAIG0gMBKC5tPgAABAgQI1AkIrLqTW5gAAQIECBBICwistLD5BAgQIECAQJ2AwKo7uYUJECBAgACBtIDASgubT4AAAQIECNQJCKy6k1uYAAECBAgQSAsIrLSw+QQIECBAgECdgMCqO7mFCRAgQIAAgbSAwEoLm0+AAAECBAjUCQisupNbmAABAgQIEEgLCKy0sPkECBAgQIBAnYDAqju5hQkQIECAAIG0gMBKC5tPgAABAgQI1AkIrLqTW5gAAQIECBBICwistLD5BAgQIECAQJ2AwKo7uYUJECBAgACBtIDASgubT4AAAQIECNQJCKy6k1uYAAECBAgQSAsIrLSw+QQIECBAgECdgMCqO7mFCRAgQIAAgbSAwEoLm0+AAAECBAjUCQisupNbmAABAgQIEEgLCKy0sPkECBAgQIBAnYDAqju5hQkQIECAAIG0gMBKC5tPgAABAgQI1AkIrLqTW5gAAQIECBBICwistLD5BAgQIECAQJ2AwKo7uYUJECBAgACBtIDASgubT4AAAQIECNQJCKy6k1uYAAECBAgQSAsIrLSw+QQIECBAgECdgMCqO7mFCRAgQIAAgbSAwEoLm0+AAAECBAjUCQisupNbmAABAgQIEEgLCKy0sPkECBAgQIBAnYDAqju5hQkQIECAAIG0gMBKC5tPgAABAgQI1AkIrLqTW5gAAQIECBBICwistLD5BAgQIECAQJ2AwKo7uYUJECBAgACBtIDASgubT4AAAQIECNQJCKy6k1uYAAECBAgQSAsIrLSw+QQIECBAgECdgMCqO7mFCRAgQIAAgbSAwEoLm0+AAAECBAjUCQisupNbmAABAgQIEEgLCKy0sPkECBAgQIBAnYDAqju5hQkQIECAAIG0gMBKC5tPgAABAgQI1AkIrLqTW5gAAQIECBBICwistLD5BAgQIECAQJ2AwKo7uYUJECBAgACBtIDASgubT4AAAQIECNQJCKy6k1uYAAECBAgQSAsIrLSw+QQIECBAgECdgMCqO7mFCRAgQIAAgbSAwEoLm0+AAAECBAjUCQisupNbmAABAgQIEEgLCKy0sPkECBAgQIBAnYDAqju5hQkQIECAAIG0gMBKC5tPgAABAgQI1AkIrLqTW5gAAQIECBBICwistLD5BAgQIECAQJ2AwKo7uYUJECBAgACBtIDASgubT4AAAQIECNQJCKy6k1uYAAECBAgQSAsIrLSw+QQIECBAgECdgMCqO7mFCRAgQIAAgbSAwEoLm0+AAAECBAjUCQisupNbmAABAgQIEEgLCKy0sPkECBAgQIBAnYDAqju5hQkQIECAAIG0gMBKC5tPgAABAgQI1AkIrLqTW5gAAQIECBBICwistLD5BAgQIECAQJ2AwKo7uYUJECBAgACBtIDASgubT4AAAQIECNQJCKy6k1uYAAECBAgQSAsIrLSw+QQIECBAgECdgMCqO7mFCRAgQIAAgbSAwEoLm0+AAAECBAjUCQisupNbmAABAgQIEEgLCKy0sPkECBAgQIBAnYDAqju5hQkQIECAAIG0gMBKC5tPgAABAgQI1AkIrLqTW5gAAQIECBBICwistLD5BAgQIECAQJ2AwKo7uYUJECBAgACBtIDASgubT4AAAQIECNQJCKy6k1uYAAECBAgQSAsIrLSw+QQIECBAgECdgMCqO7mFCRAgQIAAgbSAwEoLm0+AAAECBAjUCQisupNbmAABAgQIEEgLCKy0sPkECBAgQIBAnYDAqju5hQkQIECAAIG0gMBKC5tPgAABAgQI1AkIrLqTW5gAAQIECBBICwistLD5BAgQIECAQJ2AwKo7uYUJECBAgACBtIDASgubT4AAAQIECNQJCKy6k1uYAAECBAgQSAsIrLSw+QQIECBAgECdgMCqO7mFCRAgQIAAgbSAwEoLm0+AAAECBAjUCQisupNbmAABAgQIEEgLCKy0sPkECBAgQIBAnYDAqju5hQkQIECAAIG0gMBKC5tPgAABAgQI1AkIrLqTW5gAAQIECBBICwistLD5BAgQIECAQJ2AwKo7uYUJECBAgACBtIDASgubT4AAAQIECNQJCKy6k1uYAAECBAgQSAsIrLSw+QQIECBAgECdgMCqO7mFCRAgQIAAgbSAwEoLm0+AAAECBAjUCQisupNbmAABAgQIEEgLCKy0sPkECBAgQIBAnYDAqju5hQkQIECAAIG0gMBKC5tPgAABAgQI1AkIrLqTW5gAAQIECBBICwistLD5BAgQIECAQJ2AwKo7uYUJECBAgACBtIDASgubT4AAAQIECNQJCKy6k1uYAAECBAgQSAv8A6wTuhRPAwzSAAAAAElFTkSuQmCC",
    TxID: "22222222",
    Side: "Buy",
    Amount: 1,
    PriceLimit: 1
  },
  {
    ID: 4,
    TokenID: "2362836298793475934759834769348798345",
    TokenName: "TokenName2",
    TokenImage:
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAlgAAAEsCAYAAAAfPc2WAAATPklEQVR4Xu3dTauVdRvG4b+kmIQIgYEhSIQ6FWpgElHhF3CiBjmLoEywQSFGjS2JXqEEoUEQTfwCCmn5EaJhhak4CQfqQMqXuBdseWKro/t82HEeeyh6sa/jWoMfa917u+ratWt3hy8CBAgQIECAAIHZBFYJrNksDSJAgAABAgQILAQElhcCAQIECBAgQGBmAYE1M6hxBAgQIECAAAGB5TVAgAABAgQIEJhZQGDNDGocAQIECBAgQEBgeQ0QIECAAAECBGYWEFgzgxpHgAABAgQIEBBYXgMECBAgQIAAgZkFBNbMoMYRIECAAAECBASW1wABAgQIECBAYGYBgTUzqHEECBAgQIAAAYHlNUCAAAECBAgQmFlAYM0MahwBAgQIECBAQGB5DRAgQIAAAQIEZhYQWDODGkeAAAECBAgQEFheAwQIECBAgACBmQUE1sygxhEgQIAAAQIEBJbXAAECBAgQIEBgZgGBNTOocQQIECBAgAABgeU1QIAAAQIECBCYWUBgzQxqHAECBAgQIEBAYHkNECBAgAABAgRmFhBYM4MaR4AAAQIECBAQWF4DBAgQIECAAIGZBf4vgfXnn3+OW7dujY0bN45HHnlk2Qp//fXXuHr16r/+fM2aNePxxx8fq1atmnll4wgQIECAAAECWYF4YF25cmUcPHhwscWBAwfGnj17lm30448/js8+++y+m27ZsmW88cYbY9u2bVkJ0wkQIECAAAECMwnEA+vzzz8f586dW3y70ztSJ0+efGBgrVu3bjz//PPj7t274/fffx8XLlxYvPM1vYv15Zdfjk2bNs20tjEECBAgQIAAgZxANLBu3749XnnllUUwPfnkk+PixYvj2LFjy96NWnoH66mnnhoff/zxv7Z97bXXFh8f7t69e7z55ps5CZMJECBAgAABAjMJRAPrhx9+WLzz9Nxzz41du3Yt4umZZ54Z77333r++/YcF1tdffz1Onz49Xn755fHWW2/NtLYxBAgQIECAAIGcQDSwDh06NC5fvjyOHz8+pnenpnezpo/8vvvuu7F27dp7Wz0osH777bdx5MiRxb/55JNPxvQ8li8CBAgQIECAwEoXiAXW0sPtGzZsGN98883CYYqk8+fPL3vYfSmwpp8wfOKJJxZ/9/r16+PGjRtj9erV4/Dhw4t3wHwRIECAAAECBP4LArHA+uKLL8bZs2fH3r17x/79+xcW00Prb7/99rKH3f/3pwgfffTRxd/9+++/x/QM1/SA+wsvvDCmZ7Eee+yx/4Kp75EAAQIECBAoF4gE1tLD7dNHe1NQrV+//h7zRx99NG7evDk+/PDDsXXr1sWf3+8jwunB+J9//nmcOHFiTO+GvfTSS2P6yNEXAQIECBAgQGClC0QCa+nh9oct/+yzz46jR48+MLCW/u0vv/wy3n///TG9szU9u+WLAAECBAgQILDSBSKBtfRw+4svvrjswfQ7d+6Mb7/9dvHR39LD7g/7KcLpo8J9+/Yt/v6pU6dWuqfvjwABAgQIECAwZg+spYfbpwfWv//++/v+1zjvvPPO+PXXX+897P6wwPrqq6/GmTNnHvhLSt2QAAECBAgQILDSBGYPrKWH23fu3Dnefffd++77008/jU8//fReNC0F1vSrG7Zv3774N9P/T3jp0qXFTxJOXx988MHYsWPHSvPz/RAgQIAAAQIElgnMHljTx3nTx3rT7756+umn70s+fUz46quvLh52n3756B9//HHf/4twCq7NmzeP119//d4D8W5IgAABAgQIEFjpArMH1kpf2PdHgAABAgQIEEgLCKy0sPkECBAgQIBAnYDAqju5hQkQIECAAIG0gMBKC5tPgAABAgQI1AkIrLqTW5gAAQIECBBICwistLD5BAgQIECAQJ2AwKo7uYUJECBAgACBtIDASgubT4AAAQIECNQJCKy6k1uYAAECBAgQSAsIrLSw+QQIECBAgECdgMCqO7mFCRAgQIAAgbSAwEoLm0+AAAECBAjUCQisupNbmAABAgQIEEgLCKy0sPkECBAgQIBAnYDAqju5hQkQIECAAIG0gMBKC5tPgAABAgQI1AkIrLqTW5gAAQIECBBICwistLD5BAgQIECAQJ2AwKo7uYUJECBAgACBtIDASgubT4AAAQIECNQJCKy6k1uYAAECBAgQSAsIrLSw+QQIECBAgECdgMCqO7mFCRAgQIAAgbSAwEoLm0+AAAECBAjUCQisupNbmAABAgQIEEgLCKy0sPkECBAgQIBAnYDAqju5hQkQIECAAIG0gMBKC5tPgAABAgQI1AkIrLqTW5gAAQIECBBICwistLD5BAgQIECAQJ2AwKo7uYUJECBAgACBtIDA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AAECBAjUCQisupNbmAABAgQIEEgLCKy0sPkECBAgQIBAnYDAqju5hQkQIECAAIG0gMBKC5tPgAABAgQI1AkIrLqTW5gAAQIECBBICwistLD5BAgQIECAQJ2AwKo7uYUJECBAgACBtIDASgubT4AAAQIECNQJCKy6k1uYAAECBAgQSAsIrLSw+QQIECBAgECdgMCqO7mFCRAgQIAAgbSAwEoLm0+AAAECBAjUCQisupNbmAABAgQIEEgLCKy0sPkECBAgQIBAnYDAqju5hQkQIECAAIG0gMBKC5tPgAABAgQI1AkIrLqTW5gAAQIECBBICwistLD5BAgQIECAQJ2AwKo7uYUJECBAgACBtIDASgubT4AAAQIECNQJCKy6k1uYAAECBAgQSAsIrLSw+QQIECBAgECdgMCqO7mFCRAgQIAAgbSAwEoLm0+AAAECBAjUCQisupNbmAABAgQIEEgLCKy0sPkECBAgQIBAnYDAqju5hQkQIECAAIG0gMBKC5tPgAABAgQI1AkIrLqTW5gAAQIECBBICwistLD5BAgQIECAQJ2AwKo7uYUJECBAgACBtIDASgubT4AAAQIECNQJCKy6k1uYAAECBAgQSAv8A6wTuhRPAwzSAAAAAElFTkSuQmCC",
    TxID: "33333333",
    Side: "Buy",
    Amount: 1,
    PriceLimit: 1
  }
];

function reducer(state, action) {
  switch (action.type) {
    case "LOAD_HISTORY":
      return {
        ...state,
        isLoading: true
      };
    case "LOAD_HISTORY_SUCCESS":
      return {
        ...state,
        isLoading: false,
        tokens: action.tokens,
        groupedTransactions: action.groupedTransactions
      };
    case "LOAD_HISTORY_FAIL":
      return {
        ...state,
        isLoading: false
      };
    case "SELECT_TOKEN":
      return {
        ...state,
        selectedTokenId: action.selectedTokenId
      };
    default:
      return state;
  }
}

function getHistoryList(result) {
  const groupedTransactions = _.groupBy(result, "TokenID");

  const tokens = Object.keys(groupedTransactions).map(tokenID => {
    const firstItemWithToken = result.find(item => item.TokenID === tokenID);
    return {
      id: tokenID,
      name: firstItemWithToken.TokenName,
      image: firstItemWithToken.TokenImage
    };
  });

  return {
    tokens,
    groupedTransactions
  };
}

const loggerMiddleware = dispatch => action => {
  dispatch(action);
  process.env.NODE_ENV === "development" && console.log("dispatched:", action);
};

const CrowdsaleHistory = () => {
  let [state, dispatch] = React.useReducer(reducer, null, initState);

  dispatch = loggerMiddleware(dispatch);
  console.log("\tstate", state);

  React.useEffect(() => {
    loadCrowdsaleHistory();
  }, []);

  async function loadCrowdsaleHistory() {
    dispatch({type: "LOAD_HISTORY"});
    try {
      // const response = await axios.get(
      //   `${process.env.serviceAPI}/bond-market/dcb/crowdsales_histories`
      // );
      const response = {data: {Result: testData}};

      dispatch({
        type: "LOAD_HISTORY_SUCCESS",
        ...getHistoryList(_.get(response, "data.Result", []))
      });
    } catch (e) {
      notification.error({message: "Load Crowdsale History Fail!"});
      dispatch({type: "LOAD_HISTORY_FAIL"});
    }
  }

  return (
    <div>
      <BreadcrumbBar
        urls={[
          {
            name: "Crowdsale",
            url: "/crowdsale"
          },
          {
            name: "History",
            url: "/crowdsale/history"
          }
        ]}
      />
      <LayoutWrapper>
        <div className={"wrapperBondHistory"}>
          <CrowdsaleHistoryList
            tokens={state.tokens}
            onClickItem={id =>
              dispatch({type: "SELECT_TOKEN", selectedTokenId: id})
            }
            selectedTokenId={state.selectedTokenId}
          />
          <CrowdsaleTransactions
            transactions={state.groupedTransactions[state.selectedTokenId]}
          />
        </div>
      </LayoutWrapper>
    </div>
  );
};
export default CrowdsaleHistory;
const Wrapper = styled.div`
  padding: 2rem;
  display: flex;
  flex-direction: row;
`;
