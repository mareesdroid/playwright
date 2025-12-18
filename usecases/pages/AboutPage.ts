import { Page } from "@playwright/test";

export interface Testimonial {
  name: string;
  testimonial: string;
  industry: string;
}

export class AboutPage {
  constructor(private page: Page) {}

  async navigateToTestimonials() {
    try {
      await this.page.locator("#menu-item-45925").hover();
      await this.page.waitForTimeout(2000);
      await this.page.locator('a:has-text("Testimonials")').first().click();
    } catch (e) {
      console.log(e);
    }

    // await this.page.locator("#menu-item-45929 > a").click({ force: true });
  }

  async getTestimonials(): Promise<Testimonial[]> {
    await this.page.waitForTimeout(10000); // added plenty of time for api response increase if needed

    const testimonialCards = this.page.locator(".ct-slide");
    const cardCount = await testimonialCards.count();
    const testimonials: Testimonial[] = [];
    for (let i = 0; i < cardCount; i++) {
      const slide = testimonialCards.nth(i);

      await slide.scrollIntoViewIfNeeded();

      // Get all text content inside ct-text-blocks within this slide
      const texts = await slide.locator(".ct-text-block").allTextContents();

      testimonials.push({
        testimonial: texts[0]?.trim() || "",
        name: texts[1]?.trim() || "",
        industry: texts[2]?.trim() || "",
      });
    }
    return testimonials;
  }
}
