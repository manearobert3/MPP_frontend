import {test} from '@playwright/test';

test('test', async ({page}) => {
    await page.goto('about:blank');

    await page.goto('http://localhost:3000/');
    await page.goto('http://localhost:3000/foods');
    await page.getByRole('button', {name: 'Chart'}).click();
    await page.getByRole('button', {name: 'Edit'}).first().click();
    await page.getByLabel('Name').click();
    await page.getByLabel('Name').fill('Apple');
    await page.getByLabel('Calories').click();
    await page.getByLabel('Calories').fill('99');
    await page.getByLabel('Fats').click();
    await page.getByLabel('Fats').fill('123');
    await page.getByLabel('Description').click();
    await page.getByLabel('Description').fill('Apple');
    await page.getByRole('button', {name: 'Submit'}).click();
    await page.getByRole('button', {name: 'Close'}).click();
    await page.getByRole('button', {name: 'Detail'}).nth(1).click();
    await page.getByRole('button', {name: 'Close'}).click();
    await page.getByRole('button', {name: 'Delete'}).nth(1).click();
    await page.getByRole('button', {name: 'Delete'}).nth(1).click();
});
