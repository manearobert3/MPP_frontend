import {test} from '@playwright/test';

test('test', async ({page}) => {
    await page.goto('http://localhost:3000/');
    await page.goto('http://localhost:3000/foods');
    await page.getByRole('button', {name: 'Add'}).click();
    await page.getByLabel('Name').click();
    await page.getByLabel('Name').fill('123');
    await page.getByRole('button', {name: 'Submit'}).click();
    await page.getByLabel('Name').fill('asd');
    await page.getByRole('button', {name: 'Submit'}).click();
    await page.getByLabel('Calories').click();
    await page.getByLabel('Calories').fill('-2');
    await page.getByRole('button', {name: 'Submit'}).click();
    await page.getByLabel('Calories').fill('123123');
    await page.getByLabel('Fats').click();
    await page.getByLabel('Fats').fill('123');
    await page.getByLabel('Description').click();
    await page.getByLabel('Description').fill('hhh');
    await page.getByRole('button', {name: 'Submit'}).click();
    await page.getByRole('button', {name: 'Close'}).click();
    await page.getByRole('button', {name: 'Chart'}).click();
});
