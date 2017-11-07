import { NgxScrollbarDemoPage } from './app.po';

describe('ngx-scrollbar-demo App', () => {
  let page: NgxScrollbarDemoPage;

  beforeEach(() => {
    page = new NgxScrollbarDemoPage ();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
