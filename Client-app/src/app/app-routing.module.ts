import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutUsComponent } from './about-us/about-us.component';
import { BlogCardComponent } from './blog-card/blog-card.component';
import { BlogListComponent } from './blog-list/blog-list.component';
import { BlogSearchComponent } from './blog-search/blog-search.component';
import { CareerDevelpmentToolsComponent } from './career-develpment-tools/career-develpment-tools.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { CustomResumePageComponent } from './custom-resume-page/custom-resume-page.component';
import { JobCategoryComponent } from './job-category/job-category.component';
import { JobCompanyComponent } from './job-company/job-company.component';
import { JobCountryAutocompleteComponent } from './job-country-autocomplete/job-country-autocomplete.component';
import { JobCountryComponent } from './job-country/job-country.component';
import { JobDisclaimerComponent } from './job-disclaimer/job-disclaimer.component';
import { JobIndexComponent } from './job-index/job-index.component';
import { JobListComponent } from './job-list/job-list.component';
import { JobNotFoundComponent } from './job-not-found/job-not-found.component';
import { JobOneCatComponent } from './job-one-cat/job-one-cat.component';
import { JobOneCompanyComponent } from './job-one-company/job-one-company.component';
import { JobOneCountryComponent } from './job-one-country/job-one-country.component';
import { JobPageComponent } from './job-page/job-page.component';
import { UnderDevelopmentComponent } from './under-development/under-development.component';

const routes: Routes = [
  {path: '', component: JobIndexComponent, pathMatch :'full' },
  {path: 'Jobs/All-Categories',component: JobCategoryComponent},
  {path: 'Jobs/All-Countries',component: JobCountryComponent},
  {path: 'Jobs/All-Companies',component: JobCompanyComponent},
  {path: 'Jobs/:job/:search/:country/:category/:company/:days/:page', component: JobListComponent},
  {path: 'Jobs', component: JobListComponent},
  {path: 'career-advice/search/:str',component: BlogSearchComponent},
  {path: 'career-advice/:category', component: BlogListComponent},
  {path: 'about-us', component: AboutUsComponent},
  {path: 'contact-us', component: ContactUsComponent},
  {path: 'building', component: UnderDevelopmentComponent},
  {path: 'search/:search', redirectTo: 'Jobs/find-job/:search/country/category/company/0/1'},
  {path: 'professional-resume-writing-service', component: CustomResumePageComponent},
  {path: 'Job-category/:cat', component: JobOneCatComponent},
  {path: 'Job-country/:count',component: JobOneCountryComponent},
  {path: 'Job-company/:comp',component: JobOneCompanyComponent},
  {path: 'Job/:job', component: JobPageComponent},
  {path: 'disclaimer', component: JobDisclaimerComponent},
  {path: 'test', component: JobCountryAutocompleteComponent},
  {path: 'advice/:url', component: BlogCardComponent},
  {path: 'Career-development-tools', component: CareerDevelpmentToolsComponent},
  {path: 'jobs', redirectTo: '/Jobs', pathMatch: 'full'},
  {path: '**', component: JobNotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled', initialNavigation: 'enabled' })],
  exports: [RouterModule]
})

export class AppRoutingModule { }