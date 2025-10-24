$('#myModal').on('shown.bs.modal', function () {
    $('#myInput').trigger('focus')
})

var app = new Vue({
    el: '#app',
    data: {
        recentExperiences: [{
                productName: 'Power Inbox Web Portal',
                productType: 'Customer Web Portal',
                role: 'Senior Developer',
                company: 'Power Inbox',
                technology: ['ASP.NET', 'Service Bus', 'Redis', 'AngularJs'],
                imageUrl: './img/pi.jpg',
                timeline: '6/2017-Present'
            },
            {
                productName: 'StN (Soup to Nuts)',
                productType: 'Intranet Web Portal',
                role: 'Director of Technology',
                company: 'Best Time Entertainment',
                technology: ['ASP.NET', 'AngularJs', 'Dev Ops'],
                imageUrl: './img/bte.png',
                timeline: '2/2013 - 01/2017'
            },
           ,
            ,
          ,
            
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
            role: 'E-commerce Developer',
            productName: 'Ordo Upcyclum',
            productType: 'E-commerce - Upcycled Warhammer 40k Art',
            url: 'https://ordoupcyclum.com',
            technology: ['E-commerce Platform', 'Product Photography', 'UX Design'],
            imageUrl: './img/ordo.png',
            timeline: '2024'
        }, {
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
        }],
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
        }]
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