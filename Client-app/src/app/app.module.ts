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
import { LandingPagePartner } from './job-landing-page/partner-companies/partner-component';
import { LandingPageCategory } from './job-landing-page/4-col-box/category-component';
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
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ShareButtonsComponent } from './share-buttons/share-buttons.component';
import { BlogSearchComponent } from './blog-search/blog-search.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { CustomResumePageComponent } from './custom-resume-page/custom-resume-page.component';
import { NgxJsonLdModule } from '@ngx-lite/json-ld';
import { JobDisclaimerComponent } from './job-disclaimer/job-disclaimer.component';
import { JobOneCatComponent } from './job-redirect/job-one-cat.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { NgxSpinnerModule } from "ngx-spinner";
import { CareerDevelpmentToolsComponent } from './career-develpment-tools/career-develpment-tools.component';
import { JobFrontBoxComponent,JobBox2Component } from './job-front-box/job-front-box.component';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { en_US } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzAutocompleteModule } from 'ng-zorro-antd/auto-complete';
import { MatChipsModule } from '@angular/material/chips';
import { JobSinglePageComponent } from './job-single-page/job-single-page.component';
import { JobSideBarComponent, AlterBox } from './job-side-bar/job-side-bar.component';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { JobPositionsComponent } from './job-positions/job-positions.component';
import { JobSeoPartComponent } from './job-seo-part/job-seo-part.component';
import { JobTrendingSearchComponent } from './job-trending-search/job-trending-search.component';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { ResumeBuilderHomeComponent } from './resume-builder-home/resume-builder-home.component';
import { JobBlogListComponent } from './job-blog-list/job-blog-list.component';
import { JobBlogCardComponent } from './job-blog-card/job-blog-card.component';
import { NzTableModule } from 'ng-zorro-antd/table';
import { JobBlogSearchComponent } from './job-blog-search/job-blog-search.component';

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
    JobBlogListComponent,
    JobBlogCardComponent,
    JobBlogSearchComponent,
    JobCountryComponent,
    JobCategoryComponent,
    JobCompanyComponent,
    UnderDevelopmentComponent,
    BlogListComponent,
    ShareButtonsComponent,
    BlogSearchComponent,
    AboutUsComponent,
    ContactUsComponent,
    CustomResumePageComponent,
    JobDisclaimerComponent,
    JobOneCatComponent,
    CareerDevelpmentToolsComponent,
    JobFrontBoxComponent,
    LandingPageCategory,
    LandingPageFeatured,
    LandingPagePartner,
    JobBox2Component,
    JobSinglePageComponent,
    JobSideBarComponent,
    AlterBox,
    JobPositionsComponent,
    JobSeoPartComponent,
    JobTrendingSearchComponent,
    ResumeBuilderHomeComponent,
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
    NgxJsonLdModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    NgxSpinnerModule,
    NzDropDownModule,
    NzInputModule,
    NzIconModule,
    NzAutocompleteModule,
    MatChipsModule,
    NzRadioModule,
    NzAlertModule,
    NzSelectModule,
    NzSwitchModule,
    NzPaginationModule,
    NzTableModule
  ],
  providers: [{ provide: NZ_I18N, useValue: en_US }],
  bootstrap: [AppComponent]
})

export class AppModule { }