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

  describe('see validation errors', async () => {
    beforeEach(async () => {
      await page.click('form button');
    });

    test('when form is submitted', async () => {
      const title = await page.getContentsOf('.title .red-text');
      const content = await page.getContentsOf('.content .red-text');

      expect(title).toEqual('You must provide a value');
      expect(content).toEqual('You must provide a value');
    });
  });

  describe('and using valid inputs', async () => {
    beforeEach(async () => {
      await page.type('.title input', 'My title');
      await page.type('.content input', 'My content');
      await page.click('form button');
    });

    test('submitting take user to review screen', async () => {
      const content = await page.getContentsOf('h5');
      expect(content).toEqual('Please confirm your entries');
    });

    test('submitting then saving adds on blog screen', async () => {
      await page.click('button.green');
      await page.waitFor('.card');

      const title = await page.getContentsOf('.card-title');
      const paragraph = await page.getContentsOf('p');

      expect(title).toEqual('My title');
      expect(paragraph).toEqual('My content');
    });
  });
});

describe('When sign out,', () => {
  test('trying to create blog', async () => {
    const result = await page.evaluate(async () => {
      return fetch('api/blogs', {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: "Ferhat's Title",
          content: 'Ferhat Adibelli content creator',
        }),
      }).then((res) => res.json());
    });

    expect(result).toEqual({ error: 'You must log in!' });
  });

  test('trying to get all blogs', async () => {
    const result = await page.evaluate(async () => {
      return fetch('api/blogs', {
        method: 'GET',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
        },
      }).then((res) => res.json());
    });

    expect(result).toEqual({ error: 'You must log in!' });
  });
});
