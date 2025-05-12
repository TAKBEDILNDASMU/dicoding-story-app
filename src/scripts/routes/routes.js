import CreatePresenter from '../pages/create/CreatePresenter';
import HomePresenter from '../pages/home/HomePresenter';

// use for clean up to prevent memory leaks
let currentPresenter = null;

export const routes = {
  '/': () => {
    // clean up previous presenter if exist
    if (currentPresenter) {
      currentPresenter.handlePageUnmount();
    }
    currentPresenter = new HomePresenter();
    return currentPresenter;
  },
  '/create': () => {
    currentPresenter = new CreatePresenter();
    return currentPresenter;
  },
};
