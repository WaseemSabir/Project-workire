import { Component, OnInit } from '@angular/core';
import { DeafultLocService } from 'src/app/api-call.service';

@Component({
    selector: 'app-landingpage-category',
    templateUrl: './category.html',
    styleUrls: ['./category.css']
  })
export class LandingPageCategory implements OnInit {

    keys = Object.keys
    country : string = ''

    constructor (private loc : DeafultLocService) {}

    all : any = {
        'Jobs By Category' : {
            showMore : false,
            fullData : [],
            data : [],
            link : '/Jobs/All-Categories'
        },
        'Jobs By Location' : {
            showMore : false,
            fullData : [],
            data : [],
            link : '/Jobs/All-Countries'
        },
        'Jobs By Designation' : {
            showMore : false,
            fullData : [],
            data : [],
            link : '/Jobs/All-Positions'
        },
        'Trending Searches' : {
            showMore : false,
            fullData : [],
            data : [],
            link : '/Jobs/Trending-Search'
        }
    }

    ngOnInit() {
        this.loc.getAllSeoCat().toPromise()
        .then((res : any)=>{
            this.all['Jobs By Category'].fullData = [];
            for(let val of res.category)
            {
                try{
                    if(val.SEO_NAME && val.Show_On_Homepage)
                    {
                        this.all['Jobs By Category'].fullData.push([val.SEO_NAME,'/Job-category/'+val.SEO_NAME]);
                    }  
                }
                catch{}
            }
            this.initData();
        })
        .catch((err)=>console.log(err))

        this.loc.getCustomCountries().toPromise()
        .then((res : any)=>{
            this.all['Jobs By Location'].fullData = []
            for(let object of res)
            {
                if(object.Show_On_Homepage) {
                    this.all['Jobs By Location'].fullData.push(['Jobs in '+object.Country,'/Job-country/'+object.Country]);
                    for(let city of object.cities.split(','))
                    {
                        if(city.length)
                        {
                            this.all['Jobs By Location'].fullData.push(['Jobs in '+city,'/Job-country/'+city+'-'+object.Country])
                        }
                    }
                }
            }
            this.initData();
        })
        .catch((err)=>console.log(err))

        this.loc.getPositions().toPromise()
        .then((res : any)=>{
            this.all['Jobs By Designation'].fullData = [];
            for(let val of res)
            {
                try{
                    if(val.Show_On_Homepage)
                    {
                        this.all['Jobs By Designation'].fullData.push([val.designation+ ' Jobs','/Job-by-position/'+val.designation]);
                    }  
                }
                catch{}
            }
            this.initData();
        })
        .catch((err)=>console.log(err))

        this.loc.getTrendingSearches().toPromise()
        .then((res : any)=>{
            let countries = res.map((val : any)=>{
                try {
                    let url = val.url.toLowerCase()
                    let c = url.split('-in-')[1].replace(/-/g,' ')
                    return c
                }
                catch {
                    return 'random'
                }
            })

            this.all['Trending Searches'].fullData = [];
            for(let val of res)
            {
                try{
                    if(val.Show_On_Homepage)
                    {
                        val.search = val.search.replace("United Arab Emirates","UAE")
                        val.search = val.search.replace("Manufacturing Operations","Operations")
                        this.all['Trending Searches'].fullData.push([val.search,'/trending-search/'+val.url]);

                    }  
                }
                catch{}
            }
            this.reArrangeTredingsearch(countries)
            this.initData();
        })
        .catch((err)=>console.log(err))


        this.loc.featued$.subscribe(
            data =>{
                this.country = data.country;
                this.reArrangeCountries();
            }
        )
    }

    initData()
    {
        for(let k of Object.keys(this.all))
        {
            let temp = this.all[k];
            if(temp.showMore)
            {
                temp.data = temp.fullData.slice(0,25);
            }
            else
            {
                temp.data = temp.fullData.slice(0,10);
            }
        }

        if(this.country.length) this.reArrangeCountries();
    }

    reArrangeCountries() {
        let list1 : any[] = []
        let list2 : any[] = []
        for(let k of this.all['Jobs By Location'].fullData)
        {
            if(k[1].includes(this.country)) list1.push(k);
            else list2.push(k);
        }
        this.all['Jobs By Location'].fullData = [...list1,...list2];
    }

    reArrangeTredingsearch(countries : string[]) {
        let list1 : any[] = []
        let list2 : any[] = []
        for(let k=0;k<this.all['Trending Searches'].fullData.length;k++)
        {
            if(countries[k].includes(this.country.toLowerCase())) list1.push(this.all['Trending Searches'].fullData[k]);
            else list2.push(this.all['Trending Searches'].fullData[k]);
        }
        this.all['Trending Searches'].fullData = [...list1,...list2];
    }

    seeMoreClick(str : string)
    {
        this.all[str].showMore = (!this.all[str].showMore);
        this.initData();
    }
}