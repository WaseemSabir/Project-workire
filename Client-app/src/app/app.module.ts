import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { JobNavComponent } from './job-nav/job-nav.component';
import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { JobSearchComponent } from './job-search/job-search.component';
import { JobFooterComponent } from './job-footer/job-footer.component';
import { JobIndexComponent } from './job-index/job-index.component';
import { JobNotFoundComponent } from './job-not-found/job-not-found.component';
import { JobPageComponent } from './job-page/job-page.component';
import { JobLandingPageComponent } from './job-landing-page/job-landing-page.component';
import { LandingPageFeatured } from './job-landing-page/featured-job/featured-component';
import { LandingPageCategory } from './job-landing-page/category/category-component';
import { BlogCardComponent } from './blog-card/blog-card.component';
import { JobFeaturedComponent } from './job-featured/job-featured.component';
import { JobListComponent } from './job-list/job-list.component';
import { JobListFilterComponent } from './job-list-filter/job-list-filter.component';
import { JobListCardsComponent } from './job-list-cards/job-list-cards.component';
import { JobCountryComponent } from './job-country/job-country.component';
import { JobCategoryComponent } from './job-category/job-category.component';
import { JobCompanyComponent } from './job-company/job-company.component';
import { UnderDevelopmentComponent } from './under-development/under-development.component';
import { BlogListComponent } from './blog-list/blog-list.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { JobParallelComponent } from './job-parallel/job-parallel.component';
import { ShareButtonsComponent } from './share-buttons/share-buttons.component';
import { BlogSearchComponent } from './blog-search/blog-search.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { CustomResumePageComponent } from './custom-resume-page/custom-resume-page.component';
import { NgxJsonLdModule } from '@ngx-lite/json-ld';
import { JobDisclaimerComponent } from './job-disclaimer/job-disclaimer.component';
import { JobOneCatComponent } from './job-one-cat/job-one-cat.component';
import { JobOneCountryComponent } from './job-one-country/job-one-country.component';
import { JobOneCompanyComponent } from './job-one-company/job-one-company.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { JobCountryAutocompleteComponent } from './job-country-autocomplete/job-country-autocomplete.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatMenuModule } from '@angular/material/menu'
import { MatRadioModule } from '@angular/material/radio'
import { MatBadgeModule } from '@angular/material/badge'
import { MatCheckboxModule } from '@angular/material/checkbox';
import { NgxSpinnerModule } from "ngx-spinner";
import { CareerDevelpmentToolsComponent } from './career-develpment-tools/career-develpment-tools.component';
import { JobFrontBoxComponent } from './job-front-box/job-front-box.component';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { en_US } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';

registerLocaleData(en);

@NgModule({
  declarations: [
    AppComponent,
    JobNavComponent,
    JobSearchComponent,
    JobFooterComponent,
    JobIndexComponent,
    JobNotFoundComponent,
    JobPageComponent,
    JobLandingPageComponent,
    BlogCardComponent,
    JobFeaturedComponent,
    JobListComponent,
    JobListFilterComponent,
    JobListCardsComponent,
    JobCountryComponent,
    JobCategoryComponent,
    JobCompanyComponent,
    UnderDevelopmentComponent,
    BlogListComponent,
    JobParallelComponent,
    ShareButtonsComponent,
    BlogSearchComponent,
    AboutUsComponent,
    ContactUsComponent,
    CustomResumePageComponent,
    JobDisclaimerComponent,
    JobOneCatComponent,
    JobOneCountryComponent,
    JobOneCompanyComponent,
    JobCountryAutocompleteComponent,
    CareerDevelpmentToolsComponent,
    JobFrontBoxComponent,
    LandingPageCategory,
    LandingPageFeatured
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    AppRoutingModule,
    MDBBootstrapModule.forRoot(),
    HttpClientModule,
    HttpClientJsonpModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatProgressSpinnerModule,
    NgxJsonLdModule,
    MatAutocompleteModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatSelectModule,
    MatFormFieldModule,
    MatMenuModule,
    MatRadioModule,
    MatBadgeModule,
    MatCheckboxModule,
    NgxSpinnerModule,
    NzDropDownModule
  ],
  providers: [{ provide: NZ_I18N, useValue: en_US }],
  bootstrap: [AppComponent]
})

export class AppModule { }