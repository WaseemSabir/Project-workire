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
import { JobCountryComponent } from './job-country/job-country.component';
import { JobDisclaimerComponent } from './job-disclaimer/job-disclaimer.component';
import { JobIndexComponent } from './job-index/job-index.component';
import { JobListComponent } from './job-list/job-list.component';
import { JobNotFoundComponent } from './job-not-found/job-not-found.component';
import { JobPositionsComponent } from './job-positions/job-positions.component';
import { JobSinglePageComponent } from './job-single-page/job-single-page.component';
import { JobTrendingSearchComponent } from './job-trending-search/job-trending-search.component';
import { ResumeBuilderHomeComponent } from './resume-builder-home/resume-builder-home.component';
import { UnderDevelopmentComponent } from './under-development/under-development.component';

const routes: Routes = [
  {path: '', component: JobIndexComponent, pathMatch :'full' },
  {path: 'Jobs/All-Categories',component: JobCategoryComponent},
  {path: 'Jobs/All-Countries',component: JobCountryComponent},
  {path: 'Jobs/All-Companies',component: JobCompanyComponent},
  {path: 'Jobs/All-Positions',component: JobPositionsComponent},
  {path: 'Jobs/Trending-Search',component: JobTrendingSearchComponent},
  {path: 'Job-search/:var', component: JobListComponent},
  {path: 'Job-by-position/:var', component: JobListComponent},
  {path: 'Job-category/:var', component: JobListComponent},
  {path: 'Job-country/:var',component: JobListComponent},
  {path: 'Job-company/:var',component: JobListComponent},
  {path: 'trending-search/:var',component: JobListComponent},
  {path: 'Jobs', component: JobListComponent},
  {path: 'Jobs/:payload', component: JobListComponent},
  {path: 'career-advice/search/:str',component: BlogSearchComponent},
  {path: 'career-advice', component: BlogListComponent, pathMatch : 'full'},
  {path: 'about-us', component: AboutUsComponent},
  {path: 'contact-us', component: ContactUsComponent},
  {path: 'professional-resume-writing-service', component: CustomResumePageComponent},
  {path: 'Job/:job/:id', component: JobSinglePageComponent},
  {path: 'disclaimer', component: JobDisclaimerComponent},
  {path: 'career-advice/:url', component: BlogCardComponent},
  {path: 'Career-development-tools', component: CareerDevelpmentToolsComponent},

  /* Dublicate url for seo and bread crums */
  {path: 'Job-category',component: JobCategoryComponent},
  {path: 'Job-country',component: JobCountryComponent},
  {path: 'Job-company',component: JobCompanyComponent},
  {path: 'Job-by-position',component: JobPositionsComponent},
  {path: 'trending-search',component: JobTrendingSearchComponent},

  /* Under Development & Url 404 */
  {path: 'test', component: ResumeBuilderHomeComponent},
  {path: 'building', component: UnderDevelopmentComponent},
  {path: '**', component: JobNotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled', initialNavigation: 'enabled' })],
  exports: [RouterModule]
})

export class AppRoutingModule { }