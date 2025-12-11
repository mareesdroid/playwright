import { test } from '@playwright/test'

test('on hover text', async ({ page }) => {
    await page.goto('https://the-internet.herokuapp.com/hovers')

    for (let i = 0; i < 3; i++) {
        const text = await page.locator(`//*[@id="content"]/div/div[${i + 1}]/div/h5`).textContent()
        console.log('image', i + 1, text)

        const link = await page.locator(`//*[@id="content"]/div/div[${i + 1}]/div/a`).textContent()
        console.log('anchor txt', i + 1, link)

    }
})


test('radio button', async ({page}) => {
    await page.goto('https://leafground.com/radio.xhtml')
    await page.locator('//*[@id="j_idt87:console1"]/tbody/tr/td[3]/div/div[2]/span').click()

    await page.waitForTimeout(2000)
})

test('dropdown', async({page}) => {
    await page.goto('https://the-internet.herokuapp.com/dropdown')


    await page.locator('#dropdown').selectOption('Option 2')

    await page.waitForTimeout(3000)
    
})