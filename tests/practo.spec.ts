import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { HospitalsSearchPage } from '../pages/HospitalSearchPage';
import { DiagnosticsPage } from '../pages/DiagnosticsPage';
import { CorporateWellnessPage } from '../pages/CorporateWellnessPage';

test.describe('Practo flows (POM)', () => {
 
  test('Hospitals: counts + titles + lab test top cities @smoke @sanity @regression', async ({ page }) => {
    const home = new HomePage(page);
    const hospitals = new HospitalsSearchPage(page);

    await home.open();
    await home.goToHospitalsSearch('Bangalore');

    const openCount = await hospitals.countOpen24x7WithScroll();
    expect(openCount).toBeGreaterThan(0);

    const ratingCount = await hospitals.countRatingsWithScroll();
    expect(ratingCount).toBeGreaterThan(0);

    const openTitles = await hospitals.getOpen24x7HospitalTitles();
    console.log('Open 24x7 Titles:', openTitles);
    expect(openTitles.length).toBeGreaterThan(0);

    const ratedTitles = await hospitals.getRatedHospitalTitles();
    console.log('Rated (4.0/4.5) Titles:', ratedTitles);
    expect(ratedTitles.length).toBeGreaterThan(0);

    await home.open();
    await home.clickLabTestsTab();
    const topCities = await home.getLabTestsTopCityTexts();
    console.log('Lab Tests Top Cities:', topCities);
    expect(topCities.length).toBeGreaterThan(0);
  });

  test('Diagnostics: parse and list all cities @smoke @sanity @regression', async ({ page }) => {
    const diagnostics = new DiagnosticsPage(page);
    await diagnostics.open();
    await diagnostics.acceptCookiesIfPresent();
    await diagnostics.progressiveScroll(8, 800, 200);

    const cities = await diagnostics.getCitiesServed();
    console.log('\n=== Cities Served (Diagnostics) ===');
    cities.forEach((c, i) => console.log(`${i + 1}. ${c}`));
    expect(cities.length).toBeGreaterThan(0);
  });

  test('Corporate: full validation + inline errors @smoke @sanity @regression', async ({ page }) => {
    const corp = new CorporateWellnessPage(page);
    await corp.open();
    await corp.waitForReady();

    await corp.fillForm({
      name: 'A.Praneetha',
      company: 'Textiles Industry',
      phone: '1234567890',
      email: 'athukuripraneetha@gmail.com',
      size: '501-1000',
      interest: 'Taking a demo',
    });

    const valid = await corp.localValidate();
    console.log('\n=== FIELD CHECK RESULTS ===');
    console.log('Name Valid?     →', valid.isValidName ? 'Correct' : 'Wrong');
    console.log('Company Valid?  →', valid.isValidCompany ? 'Correct' : ' Wrong');
    console.log('Phone Valid?    →', valid.isValidPhone ? 'Correct' : ' Wrong');
    console.log('Email Valid?    →', valid.isValidEmail ? 'Correct' : ' Wrong');

    await corp.submitForm();
    const messages = await corp.getInlineErrorMessages();
    console.log('\n=== Page Validation Messages ===');
    console.log(messages.length ? messages.join(' | ') : 'No inline errors displayed');

    await expect(page).toHaveURL(/corporate/i);
  });
});
