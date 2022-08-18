import { Router } from "react-router-dom";
import React, {
  ReactChild,
  ReactNode,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import { view } from "@forge/bridge";
import { useAsync } from "react-use";
import { Action, History, Location, Update } from "history";

interface Props {
  loadingView?: () => ReactChild;
  children: ReactNode;
}

/**
 * `Router` implementation for use within Atlassian Forge context.
 * The implementation resembles `BrowserRouter` with a backing `view.createHistory()` instead of the browser's history.
 * Since `view.createHistory()` is asynchronous, it is possible to display a custom `loadingView` while it completes.
 *
 * @example
 * <ForgeRouter>
 *   <Routes>
 *     <Route path="/" element={<Overview />} />
 *     <Route path="/:uid" element={<SingleView />} />
 *   </Routes>
 * </ForgeRouter>
 */
export function ForgeRouter({ loadingView, children }: Props) {
  const [history, setHistory] = useState<History | undefined>(undefined);
  const [historyState, setHistoryState] = useState<Update | undefined>(
    undefined
  );
  useAsync(async () => {
    const newHistory = await view.createHistory();
    setHistory(newHistory);
  }, []);
  useEffect(() => {
    if (!historyState && history) {
      const { action, location } = history;
      setHistoryState({ action, location });
    }
  }, [history, historyState]);
  useLayoutEffect(() => {
    // bridge implementation between mixed interfaces of history@4 from @forge/bridge and history@5 from react-router@6
    history?.listen((update: Update | Location, action?: Action) => {
      if (action) {
        update = {
          location: update as Location,
          action,
        };
        console.debug("updating history@4", update);
      } else {
        console.debug("updating history@5", update);
      }
      setHistoryState(update as Update);
    });
  }, [history]);
  const loading = !history || !historyState;
  return (
    <>
      {loading && loadingView?.()}
      {!loading && (
        <Router
          navigator={history}
          navigationType={historyState.action}
          location={historyState.location}
        >
          {children}
        </Router>
      )}
    </>
  );
}
