import {test} from '@playwright/test';

test('test', async ({page}) => {
    await page.goto('http://localhost:3000/');
    await page.getByRole('button', {name: 'Add Food'}).click();
    await page
        .locator('div')
        .filter({hasText: /^Name$/})
        .getByRole('textbox')
        .click();
    await page
        .locator('div')
        .filter({hasText: /^Name$/})
        .getByRole('textbox')
        .fill('asd1');
    await page
        .locator('div')
        .filter({hasText: /^Calories$/})
        .getByRole('textbox')
        .click();
    await page
        .locator('div')
        .filter({hasText: /^Calories$/})
        .getByRole('textbox')
        .fill('23');
    await page
        .locator('div')
        .filter({hasText: /^Fats$/})
        .getByRole('textbox')
        .click();
    await page
        .locator('div')
        .filter({hasText: /^Fats$/})
        .getByRole('textbox')
        .fill('45');
    await page.getByRole('button', {name: 'Add Food'}).click();
    await page
        .locator('div')
        .filter({hasText: /^Name$/})
        .getByRole('textbox')
        .click();
    await page
        .locator('div')
        .filter({hasText: /^Name$/})
        .getByRole('textbox')
        .fill('asd');
    await page
        .locator('div')
        .filter({hasText: /^Calories$/})
        .getByRole('textbox')
        .click();
    await page
        .locator('div')
        .filter({hasText: /^Calories$/})
        .getByRole('textbox')
        .fill('-44');
    await page
        .locator('div')
        .filter({hasText: /^Fats$/})
        .click();
    await page.getByRole('button', {name: 'Add Food'}).click();
    await page
        .locator('div')
        .filter({hasText: /^Calories$/})
        .getByRole('textbox')
        .click();
    await page
        .locator('div')
        .filter({hasText: /^Calories$/})
        .getByRole('textbox')
        .fill('123');
    await page.getByRole('button', {name: 'Add Food'}).click();
    await page.getByRole('button', {name: 'View'}).first().click();
    await page.getByText('×').click();
    await page.getByRole('button', {name: 'Delete'}).first().click();
    await page.getByRole('button', {name: 'Edit'}).first().click();
    await page
        .locator('div')
        .filter({hasText: /^Calories$/})
        .getByRole('textbox')
        .click();
    await page
        .locator('div')
        .filter({hasText: /^Calories$/})
        .getByRole('textbox')
        .fill('233');
    await page.getByRole('button', {name: 'Update Food'}).click();
});
