const Page = require('./helpers/page');

let page;

beforeEach(async () => {
  page = await Page.build();
  await page.goto('localhost:3000');
});

afterEach(async () => {
  await page.close();
});

//To group test on spesific occations
describe('When logged in', () => {
  beforeEach(async () => {
    await page.login();
    await page.click('a.btn-floating');
  });

  test('can see create form successfully', async () => {
    const content = await page.getContentsOf('form label');
    expect(content).toEqual('Blog Title');
  });
});
