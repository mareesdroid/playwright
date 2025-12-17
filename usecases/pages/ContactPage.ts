import { Page } from "@playwright/test";
import { ContactFormData } from "../types";

export class ContactPage {
  constructor(private page: Page) {}

  async getAllFormFields() {
    return this.page.locator(
      "form#hsForm_7c6e698d-8ecc-47e9-93f0-6a64c1fcc869 input, form#hsForm_7c6e698d-8ecc-47e9-93f0-6a64c1fcc869 textarea"
    );
  }

  async scrollToView() {
    const formLocator = this.page.locator(
      "form#hsForm_7c6e698d-8ecc-47e9-93f0-6a64c1fcc869"
    );
    // Scroll to the contact form
    await formLocator.scrollIntoViewIfNeeded();
  }

  async clickContactMenu() {
    await this.page.locator("text=Contact Us").first().click();
  }

  async fillContactForm(formData: ContactFormData) {
    const fields = await this.getAllFormFields();
    const count = await fields.count();

    for (let i = 0; i < count; i++) {
      const field = fields.nth(i);
      const placeholder = await field.getAttribute("placeholder");
      if (placeholder && formData[placeholder]) {
        await field.fill(formData[placeholder]);
      }
    }
  }
}
