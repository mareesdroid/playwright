import {test, chromium} from '@playwright/test';

test('validate variables', async ({page}) => {


    await page.goto('https://google.com')
    const title = await page.title()
    console.log(title)
    // let, var, const

    for(let i=0;i<10;i++){
        console.log(`value of i::`, i)
    }

})