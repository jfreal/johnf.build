$('#myModal').on('shown.bs.modal', function () {
    $('#myInput').trigger('focus')
})

var app = new Vue({
    el: '#app',
    data: {
        recentExperiences: [{
                productName: 'Power Inbox Web Portal',
                productType: 'Operational Web Portal',
                role: 'Senior Developer',
                company: 'Power Inbox',
                technology: ['ASP.NET', 'Service Bus', 'Redis'],
                imageUrl: './img/pi.jpg',
                timeline: '6/2017-Present'
            },
            {
                productName: 'StN (Soup to Nuts)',
                productType: 'Operational Web Portal',
                role: 'Director of Technology',
                company: 'Best Time Entertainment',
                technology: ['ASP.NET', 'AngularJs', 'Dev Ops'],
                imageUrl: './img/bte.png',
                timeline: '2/2013 - 01/2017'
            },
            {

                role: 'Full-Stack Development',
                productName: 'OneBag.Travel',
                url: 'https://onebag.travel/',
                role: 'Full-Stack, Founder',
                productType: 'Affiliate Website',
                company: 'One Bag Travel',
                technology: ['ASP.NET Core', 'Azure Functions', 'Cosmos Db'],
                imageUrl: './img/onebagthumb.JPG',
                timeline: '2017-Present'
            },
            {
                role: 'Full-Stack Development',
                productName: 'Terraforming Mars Cards',
                productType: 'Informational Website',
                url: 'https://terraformingmars.cards/',
                technology: ['Angular', 'Bootstrap', 'Typescript'],
                imageUrl: './img/tmcthumb.png',
                link: 'https://terraformingmars.cards/',
                timeline: '2018-Present'
            },
            {
                role: 'Full-Stack Development',
                productName: 'HCRT',
                productType: 'iPad Mobile Sales Tool',
                technology: ['AngularJS', 'D3', 'Responsive CSS'],
                imageUrl: './img/hcrt.png',
                timeline: '2016'
            }
        ],
        pastExperiences: [{
            role: 'Contract Developer',
            title: 'Teacher Lingo - P2P Ecommerce',
            technology: ['ASP.NET', 'SQL Server', 'Community Server'],
            imageUrl: './img/tl.png',
            link: 'http://www.teacherlingo.com/',
            timeline: '6/2017-Present'
        }, {
            role: 'Contract Developer',
            title: 'Mobile Event Registration App',
            technology: ['ASP.NET MVC', 'RequireJs', 'JQuery'],
            imageUrl: './img/hype.png',
            timeline: '2017-Present',
            description: `<p>Hartford Young Professionals and' +
                 'Entrepreneurs needed to better track event attendance as well as offer a platform so attendees could pay and "check in " onsite during the event. The platform is almost exclusively JavaScript with a thin web services layer
                connecting to an old foxpro database.
            </p>
            <p>
                This project had the coolest software launch I've ever had. Signs, banners and everything. <a href="/images/hypelaunch-large.jpg " target="_blank ">Picture of the launch.</a>
            </p> `
        }],
        businesses: [{
                productName: 'Movid HEP',
                productType: 'SaaS Product',
                role: 'Full-Stack Development, Founder',
                title: 'Movid HEP',
                technology: ['ASP.NET', 'AngularJS', 'RavenDb'],
                imageUrl: './img/movid-hep.png',
                timeline: '2/2012 - 1/2014',
                description: `<a href="http://app.movidhep.com/ ">Movidhep</a> helps physiotherapists prescribe their
            customers high definition video home exercise plans. As the sole developer behind Movid I
            worked on everything from UI design to the nosql
            back end.`
            },
            {
                role: 'Full-Stack Developer - Freelance',
                productName: 'Palm Classic Apparel',
                productType: 'E-commerce',

                technology: ['ASP.NET MVC', 'SQL Server'],
                imageUrl: './img/palmclassicapparel.png',
                timeline: '2009'
            }, {
                role: 'Full-Stack Developer - Freelance',
                productName: 'America\'s Acres',
                productType: 'E-commerce',
                technology: ['ASP.NET', 'SQL Server'],
                imageUrl: './img/americanacres.png',
                timeline: '2009'
            }
        ],
        earlyFreelance: [{
            role: 'Freelancer',
            title: 'Palm Classic Apparel Retail E-commerce',
            technology: ['ASP.NET', 'SQL Server'],
            imageUrl: './img/palmclassicapparel.png',
            timeline: '2009'
        }, {
            role: 'Freelancer',
            title: 'America\'s Acres',
            technology: ['ASP.NET', 'SQL Server'],
            imageUrl: './img/americanacres.png',
            timeline: '2009'
        }],
        message: 'Hello Vue!'
    },
    components: {
        'experience-component': {
            template: '#experience-component',
            props: ["experience"],
            data: function () {
                return {
                    experience: this.experience
                }
            }
        }
    }
});