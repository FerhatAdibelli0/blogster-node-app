const Page = require('./helpers/page');

let page;

beforeEach(async () => {
  page = await Page.build();
  await page.goto('localhost:3000');
});

afterEach(async () => {
  await page.close();
});

test('When logged in,see create form successfully', async () => {
  await page.login();
  await page.click('a.btn-floating');
  const content = await page.getContentsOf('form label');
  expect(content).toEqual('Blog Title');
});
