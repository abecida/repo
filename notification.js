const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');

const Mails = require('./mails/department');

var transporter = nodemailer.createTransport(sendgridTransport({
    auth: {
        api_key: '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' 
    }
}));

var receivers = ['​jelwood@calpoly.edu', 'lelu@calpoly.edu']; //['jason_elwood@yahoo.com', 'gdomber@calpoly.edu', 'tkuboi@calpoly.edu​'];

receivers = ['abecid3211@gmail.com']; 
// 'Yoo@clshs.org', 'lah@clshs.org', 'wang@creanlutheran.org', 'yang@creanlutheran.org'
// 'lelu@calpoly.edu', 'gdomer@calpoly.edu', 'jpeter65@calpoly.edu',
// 'rzalawad@calpoly.edu'

cs_networking_site_recruit = "<p>Hey Guys,</p><p>I\'m working on a networking website for computer sceince students in California to post projects, collab, give feedback, ask questions and discuss about various topics in the field of computer science.</p> <p>\nI know this is no cutting edge AI project but I think this will be pretty useful to a lot of people.</p><p><br><p>How many times did you post your code on Github? How many people actually found it and gave you feedback? When people post their projects on Github no one will find it, so there should be a networking platform where people can find and view your project</p><p> I have always admired great tech companies that build products everyone uses, and what is interesting about most of those companies is that most of the co-founders of top companies were friends from college. School has been the main way people met their cofounders and project collaborators since Steve Jobs met Wozniak at Homestead High School, and that is pretty limiting. </p><p>Finally a viable cs networking platform doesn\'t really exist currently. A platform where someone can go on share their projects to a bunch of legitimate people who can also potentially join you can collaborate with your project.</p> / Plan is to email some guys at other universiteis in California / If lucky, I can picture the platform hosting competitions, and maybe even physical conferences / I think really exciting features are: Getting to know great people at other campuses, chance to join amazing projects /  /  The bottom line is whatever your goals are and project you are working on, I think this networking site will facilitate your progress towards that goal. You could be working on a cool video game, Convolutional Neural Network or Hardware, trust me I have a few Deep Learning and IoT projects I have in mind and the website will make it a lot easier to pursue them. The bottom line is, you will be able to get a lot of great feedback and maybe even get students to join your project once this site is up and running. Even if your just an abysmal cs student not participating in any projects, with this website you will be able to have a lot more opportunities to join projects and fill your resume, if you are into that sort of thing. </p><p> I am a Node.js / Express backend developer, pretty solid but I look forward to recruiting developers who are more experienced and better than myself. I would love to have great front end developers so if you know Angular.js or other frontend frameworks please consider joining. People who know other stuff such as azure databases or even hosting related things like AWS configurations are also also welcome to join as well. If you don\'t know any web frameworks and only know how to code in Python and/or java, I think you can still contribute to the project cause most of the backend code are just algorithms and I think you can get the hang of javascript in a day.   You can visit the unfinished website here. If you want to learn more about this project, click here (plan, mission, newsletter(progress)/).  If you want to join this project, click here. Thank You. Adam.";
recruit = '<p>Hey guys</p><p>I am a computer science student at Cal Poly and I am working on a website where you can upload projects you are working on to get feedback and possibly inspire other people to join your project. </p><p>People post their code and project on Github but no one can organically find them. So I there should be an online community for computer science studetns to give each other feedback and check out each other\'s projects. </p><p>I am also going to email cs students from other UC and Cal State campuses so they can be on the network too. </p><p>Check out the demo website here</p><p>Click here if you are interested in joining the project</p>';

i = 0;
while (i < receivers.length) {
    name = receivers[i].split('@')[0];
    var mailOptions = {
        from: 'Academic Senate <academicsenate@calpoly.edu>',
            to: receivers[i],
            subject: 'You\'ve been nominated for the Distinguished Teaching Award!',
            html: teaching_award1+name+teaching_award2
    };
    const date = new Date();
    console.log('Sending to '+receivers[i]+ ' at '+date.getHours()+':'+date.getMinutes())
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email is successfully sent'); // info.response
        }
    });
    i += 1;
}