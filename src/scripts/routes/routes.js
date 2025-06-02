import BookmarkPage from '../pages/bookmark/BookmarkPage';
import CreatePage from '../pages/create/CreatePage';
import HomePage from '../pages/home/HomePage';

let page = null;

export const routes = {
  '/': () => {
    if (page !== null && page.cameraManager !== undefined) {
      console.log(page.cameraManager);
      page.cameraManager.stopCamera();
    }

    page = new HomePage();
    return page;
  },
  '/create': () => {
    page = new CreatePage();
    return page;
  },
  '/bookmarks': () => {
    page = new BookmarkPage();
    return page;
  },
};
