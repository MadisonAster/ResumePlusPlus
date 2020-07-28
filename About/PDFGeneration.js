////////////////////Dialog//////////////////////////
function ResumeDialog() {
    $( "#ResumeDialog" ).dialog({
            modal: true,
            autoOpen: false,
    });
    
    if ($('#JobTypeDropdownMenu').children().length == 0){
        window.JobTypes = GetJobTypesInfo();
        for (var title in window.JobTypes) {
            var JobData = window.JobTypes[title];
            //$('#JobTypeDropdownMenu').append('<a class="dropdown-item" href="#">'+title+'</a>');
            $('#JobTypeDropdownMenu').append('<a class="dropdown-item" href="javascript:void(0);" onclick="SetJobType(\''+title+'\');">'+title+'</a>');
        };
    };
    if ($('#DialogSkillsCloud').children().length == 0){
        var SkillSets = GetSkillSets();

        var SkillButtonClasses = [
            /*"SkillButtonDarkGrey",*/
            "SkillButtonRed",
            "SkillButtonOrange",
            "SkillButtonYellow",
            "SkillButtonGreen",
            "SkillButtonBlue",
            "SkillButtonViolet",
        ];
        var count = 0;
        for (var skillset in SkillSets){
            var SkillButtonClass = SkillButtonClasses[count];
            count += 1;
            for (var i = 0; i < SkillSets[skillset].length; i++){
                var Skill = SkillSets[skillset][i];
                $('#DialogSkillsCloud').append('<input class="SkillCheckBox '+SkillButtonClass+'" type="checkbox" checked autocomplete="off" id="cbox_'+Skill['title']+'">');
                $('#DialogSkillsCloud').append('<label class="btn checkbox SkillButton '+SkillButtonClass+'" for="cbox_'+Skill['title']+'">'+Skill['title']+'</label>');
                
            };
            $('#DialogSkillsCloud').append('<br/>');
        };
    };
    
    if ($('#DialogProjectsList').children().length == 0){
        for (var key in window.Projects){
            if (['pagination','remove','sortOn'].indexOf(key) == -1){
                var Project = window.Projects[key];
                $('#DialogProjectsList').append('<div class="CheckboxContainer"><input type="checkbox" checked autocomplete="off" id="pbox_'+Project['title'].replaceAll(' ','')+'" style="display:none;">'
                                                +'<label class="ProjectCheckBox" for="pbox_'+Project['title'].replaceAll(' ','')+'"></label>'
                                                +'<label class="ProjectLabel" for="pbox_'+Project['title'].replaceAll(' ','')+'">'+'<h5 style="color:#ffffff;">'+Project['title']+'</h5>'+'    '+Project['shortdescription']
                                                +'<span class="ProjectTagsSpan">'+Project['tags'].toString().replaceAll(',','')+'</span>'+'</label></div>');
            };
        };
    };
    
    //Show Dialog
    SetJobType(GetDefaultJobType());
    disableScroll();
    $('#ResumeDialog').dialog('open');
    $('#DialogFocuser').css('display', 'block');
    $('#ResumeDialog').css('width', 'calc(82% - 80px)');
    $('#ResumeDialog').css('height', 'calc(82% - 80px)');
}

function enableScroll() {
    //console.log('enabling scroll');
    window.onscroll = window.old_onscroll;
}

function disableScroll() { 
    // Get the current page scroll position 
    window.old_onscroll = window.onscroll;

    scrollTop = window.pageYOffset || document.documentElement.scrollTop; 
    scrollLeft = window.pageXOffset || document.documentElement.scrollLeft, 
  
        // if any scroll is attempted, set this to the previous value 
        window.onscroll = function() { 
            window.scrollTo(scrollLeft, scrollTop); 
        }; 
} 

function CloseResumeDialog() {
    $('#ResumeDialog').dialog('close');
    $('#DialogFocuser').css('display', 'none');
    enableScroll();
}
////////////////////////////////////////////////////


///////////////////////Main/////////////////////////
function GenerateResume(){
    var JobTitle = GetJobTitle();
    var JobType = GetJobType();
    var ActiveSkills = GetActiveSkillList();
    var ActiveSkillSets = GetActiveSkillSets();
    var ActiveProjects = GetActiveProjectsList();
    var ActiveProjectsData = GetActiveProjectsData();
    window.PDFImageCache = [];
    window.FullStarImageCache = [];
    window.HalfStarImageCache = [];
    window.EmptyStarImageCache = [];

    console.log(JobTitle);
    console.log(JobType);
    console.log(ActiveSkills);
    console.log(ActiveSkillSets);
    console.log(ActiveProjects);
    console.log(ActiveProjectsData);

    var doc = PDFSetup();
    AddSEOData(doc);
    AddFirstPageStyling(doc);

    PDFSetPage(doc, 1);

    var headerspace = 20;
    var ycursor1 = 225;
    ycursor1 = AddNameAndTitle(doc, JobTitle, ycursor1, headerspace);
    ycursor1 = AddAvailability(doc, ycursor1, headerspace);
    ycursor1 = AddSkills(doc, ActiveSkillSets, ycursor1, headerspace);

    PDFSetPage(doc, 1);

    var headerspace = 30;
    var ycursor2 = 130;
    ycursor2 = AddProfileDetails(doc, JobTitle, ycursor2, headerspace);
    ycursor2 = AddAboutMe(doc, JobType['Objective'], ycursor2, headerspace);
    ycursor2 = AddProfessionalExperience(doc, ycursor2, headerspace);
    ycursor2 = AddEducation(doc, ycursor2, headerspace);
    //ycursor2 = AddProjects(doc, ActiveProjectsData, ImageData, ycursor2);

    PDFSetPage(doc, 1);

    AddImages(doc); //blocks until caching is complete
    AddGenerationDate(doc);
    PDFSave(doc, JobTitle);
}
//////////////////////////////////////////////////////


///////////////////Data Gathering/////////////////////
function SetJobTitle(JobTitle){
    //console.log('SetJobTitle');
    $('#JobTypeDropdownButton').text(JobTitle);
}

function GetJobTitle(){
    //console.log('GetJobTitle');
    return $('#JobTypeDropdownButton').text();
}

function SetJobType(JobTypeTitle){
    $('#JobTypeDropdownButton').text(JobTypeTitle);
    var JobData = window.JobTypes[JobTypeTitle];
    SetActiveSkillList(JobData['ActiveSkills']);
    SetActiveProjectsList(JobData['ActiveSkills']);
}

function GetJobType(){
    //console.log('GetJobType');
    return window.JobTypes[GetJobTitle()];
}

function GetSkillSets(){
    var SkillSets = {};
    for (var key in window.Skills){
        if (key != 'pagination'){
            var Skill = window.Skills[key];
            if (!(Skill['skillset'] in SkillSets)) {
                SkillSets[Skill['skillset']] = [];
            };
            SkillSets[Skill['skillset']].push(Skill);
        };
    };
    return SkillSets;
}

function GetActiveSkillSets(){
    var ActiveSkills = GetActiveSkillList();
    var SkillSets = {};
    for (var key in window.Skills){
        if (key != 'pagination'){
            var Skill = window.Skills[key];
            if (!(Skill['skillset'] in SkillSets)) {
                SkillSets[Skill['skillset']] = [];
            };
            if (ActiveSkills.indexOf(Skill['title']) > -1) {
                SkillSets[Skill['skillset']].push(Skill);
            };
        };
    };
    return SkillSets;
}

function SetActiveSkillList(ActiveSkills){
    $("[id^=cbox]").each(function() {
        var skillname = this.id.replaceAll('cbox_','');
        if (ActiveSkills.indexOf(skillname) > -1){
            this.checked = true;
        } else {
            this.checked = false;
        }
    });
}

function GetActiveSkillList(){
    var ActiveSkills = [];
    $("[id^=cbox]").each(function() {
        if (this.checked){
            ActiveSkills.push(this.id.replaceAll('cbox_',''));
        };
    });
    return ActiveSkills;
}

function SetActiveProjectsList(ActiveSkills){
    for (var key in window.Projects){
        if (['pagination','remove','sortOn'].indexOf(key) == -1){
            var Project = window.Projects[key];
            var pboxid = "pbox_"+Project['title'].replaceAll(' ','');
            var checkbox = document.getElementById(pboxid);
            checkbox.checked = false;
            for (var tag in Project['tags']) {
                var tagname = Project['tags'][tag].toString().replace(/[\r\n]+/gm, '');
                if (ActiveSkills.indexOf(tagname) > -1){
                    checkbox.checked = true;
                };
            };
        };
    };
}

function GetActiveProjectsList(){
    var ActiveProjects = [];
    $("[id^=pbox]").each(function() {
        if (this.checked){
            ActiveProjects.push(this.id.replaceAll('pbox_',''));
        };
    });
    return ActiveProjects;
}

function GetActiveProjectsData(){
    var Result = [];
    var ActiveProjects = GetActiveProjectsList();
    for (var a = 0; a < ActiveProjects.length; a++){
        var ProjectName = ActiveProjects[a];
        for (var i = 0; i < window.Projects.length; i++) {
            var Project = window.Projects[i];
            if (Project['title'].replaceAll(' ','') == ProjectName){
                Result.push(Project);
                break;
            };
        };
    };
    return Result;
}

function GetSEOTags(){
    var wordlisturl = window.location.href+'/WordList.csv';
    var wordlistdata = LoadPage(wordlisturl);
    var wordlistlines = wordlistdata.replace(/[\r\n]+/gm, '').split(',');
    return wordlistlines;
}
////////////////////////////////////////////////////


//////////////////Resume Content////////////////////
function PDFSetup(){
    var doc = new jsPDF('p', 'pt', 'letter');
    doc.setFontSize(12);
    doc.setTextColor(89, 92, 98);
    doc.setFont('helvetica');
    doc.pagecount = 1;
    doc.addFont('mesmerize-rg-normal.ttf', 'mesmerize-rg', 'normal');
    doc.addFont('mesmerize-el-normal.ttf', 'mesmerize-el', 'normal');
    doc.addFont('mesmerize-ul-normal.ttf', 'mesmerize-ul', 'normal');
    return doc;
}

function PDFAddPage(doc){
    doc.addPage();
    doc.pagecount ++;
    doc.currentpage ++;
    AddSubsequentPageStyling(doc);
}

function PDFSetPage(doc, page){
    doc.setPage(page);
    doc.currentpage = page;
}

function AddSEOData(doc, SEOTags){
    var SEOTags = GetSEOTags();
    var wordlisturl = window.location.href+'/WordList.csv';
    var wordlistdata = LoadPage(wordlisturl);
    var wordlistlines = wordlistdata.split('\n');
    doc.setTextColor(255, 255, 255);
    for (var i = 0; i < SEOTags.length; i++) {
        doc.text(SEOTags[i], 44, 20);
    };
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, doc.internal.pageSize.width, 25, 'F');
    doc.setTextColor(89, 92, 98);
}

function AddFirstPageStyling(doc){
    doc.setFillColor(231, 221, 222);
    doc.rect(0, 0, doc.internal.pageSize.width, 115, 'F');
    doc.rect(0, 0, 50, doc.internal.pageSize.height, 'F');

    doc.setFillColor(149, 186, 155);
    doc.rect(0, 115, doc.internal.pageSize.width, 20, 'F');
    doc.setFillColor(242, 204, 168);
    doc.rect(0, 135, doc.internal.pageSize.width, 20, 'F');
    doc.setFillColor(246, 135, 128);
    doc.rect(0, 155, doc.internal.pageSize.width, 20, 'F');
    doc.setFillColor(227, 84, 104);
    doc.rect(0, 175, doc.internal.pageSize.width, 20, 'F');

    doc.setFillColor(51, 60, 67);
    doc.rect(50, 0, 176, doc.internal.pageSize.height, 'F');
}

function AddSubsequentPageStyling(doc){
    doc.setFillColor(231, 221, 222);
    doc.rect(0, 0, 50, doc.internal.pageSize.height, 'F');

    doc.setFillColor(51, 60, 67);
    doc.rect(50, 0, 176, doc.internal.pageSize.height, 'F');
}

function AddNameAndTitle(doc, PositionTitle, ycursor, headerspace){
    doc.setFont('mesmerize-rg');
    doc.setCharSpace(0);

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFontStyle('normal');
    doc.text(GetFullName().toUpperCase(), 216, ycursor, {maxWidth: 156, align: "right"});
    ycursor += 45;
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.setFont('mesmerize-ul');
    doc.setFontStyle('normal');
    doc.text(PositionTitle.toLowerCase(), 216, ycursor, {maxWidth: 156, align: "right"});
    ycursor += headerspace;

    doc.setFillColor(240, 240, 240);
    doc.rect(60, ycursor, 156, 1, 'F'); //DividingLine
    ycursor += headerspace;

    doc.setFillColor(240, 240, 240);
    doc.rect(60, 8, 156, 187, 'F'); //Polaroid outline
    window.PDFImageCache.push(['./_Assets/ProfileImage.jpg', 'JPG', 69, 17, 136, 140, {url:'https://'+GetProfileURL()}]);
    window.PDFImageCache.push(['./About/ResumeImages/GitHub.png', 'PNG', 16, 116, 18, 18, {url:GetGitHubURL()}]);
    window.PDFImageCache.push(['./About/ResumeImages/DockerHub.png', 'PNG', 16, 136, 18, 18, {url:GetDockerHubURL()}]);
    window.PDFImageCache.push(['./About/ResumeImages/CodeWars.png', 'PNG', 16, 156, 18, 18, {url:GetCodeWarsURL()}]);
    window.PDFImageCache.push(['./About/ResumeImages/IMDB.png', 'PNG', 16, 176, 18, 18, {url:GetIMDBURL()}]);

    return ycursor;
}

function AddAvailability(doc, ycursor, headerspace){
    var Availability = GetAvailability().toLowerCase();
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.setFont('mesmerize-ul');
    doc.setFontStyle('normal');
    doc.text(Availability, 216, ycursor+5, {maxWidth: 156, align: "right"});
    ycursor += Math.round(Math.ceil(doc.getTextWidth(Availability) / 156) * 18);//spacing
    ycursor += 5;

    doc.setFillColor(240, 240, 240);
    doc.rect(60, ycursor, 156, 1, 'F'); //DividingLine
    ycursor += headerspace;

    return ycursor
}

function AddProfileDetails(doc, PositionTitle, ycursor, headerspace) {
    doc.setTextColor(51, 60, 67);
    doc.setFontSize(12);
    doc.setFont('mesmerize-el');
    doc.setFontStyle('normal');
    doc.textWithLink(GetProfileURL(), 250, ycursor, {align: 'left', url:'https://'+GetProfileURL()});
    ycursor += 20;
    doc.text(GetEmail(), 250, ycursor, {align: "left"});
    ycursor += 20;
    doc.text(GetPhone(), 250, ycursor, {align: "left"});
    ycursor += 20;
    doc.text(GetAddress(), 250, ycursor, {align: "left"});
    ycursor += 10;
    ycursor += headerspace;

    return ycursor;
}

function AddAboutMe(doc, AboutText, ycursor, headerspace){
    doc.setTextColor(51, 60, 67);
    doc.setFont('mesmerize-el');
    doc.setFontStyle('normal');
    doc.setFontSize(16);
    doc.text('About Me', 250, ycursor, {align: "left"});
    ycursor += headerspace;//spacing
    doc.setFontSize(12);
    doc.text(AboutText, 260, ycursor, {maxWidth: 345, align: "left"});
    ycursor += Math.round(Math.ceil(doc.getTextWidth(AboutText) / 345) * 12);//spacing
    ycursor += headerspace; //spacing
    return ycursor;
}

function AddProfessionalExperience(doc, ycursor, headerspace) {
    var ProfessionalJobs = GetProfessionalJobs();
    var ProfessionalJobIcons = GetProfessionalJobIcons();
    var ProfessionalJobURLs = GetProfessionalJobURLs();

    doc.setTextColor(51, 60, 67);
    doc.setFont('mesmerize-el');
    doc.setFontStyle('normal');
    doc.setFontSize(16);
    doc.text('Experience', 250, ycursor, {align: "left"});
    ycursor += headerspace;//spacing

    for (var j=0; j < ProfessionalJobs.length; j++){
        var job = ProfessionalJobs[j];

        window.PDFImageCache.push([ProfessionalJobIcons[j], 'PNG', 245, ycursor-10, 30, 30, {url:ProfessionalJobURLs[j]}]);

        doc.setFont('mesmerize-rg');
        doc.setFontSize(12);
        doc.textWithLink(job[0], 280, ycursor, {maxWidth: 320, align: "left", url:ProfessionalJobURLs[j]});
        ycursor += Math.ceil(doc.getTextWidth(job[0]) / 320) * 15;//spacing

        doc.setFont('mesmerize-el');
        doc.setFontSize(10);
        doc.textWithLink(job[1], 280, ycursor, {maxWidth: 320, align: "left", url:ProfessionalJobURLs[j]});
        ycursor += Math.ceil(doc.getTextWidth(job[1]) / 320) * 15;//spacing

        doc.setFont('mesmerize-ul');
        doc.textWithLink(job[2], 280, ycursor, {maxWidth: 320, align: "left", url:ProfessionalJobURLs[j]});
        ycursor += Math.ceil(doc.getTextWidth(job[2]) / 320) * 15;//spacing

        doc.setFont('mesmerize-el');
        doc.text(job[3], 280, ycursor, {maxWidth: 320, align: "left"});
        ycursor += Math.ceil(doc.getTextWidth(job[3]) / 320 + 0.1) * 15;//spacing
        
        ycursor += 5;//spacing
    }
    ycursor += headerspace-15;
    return ycursor;
}

function AddEducation(doc, ycursor, headerspace) {
    var EducationText =  GetEducationText();
    doc.setTextColor(51, 60, 67);
    doc.setFont('mesmerize-el');
    doc.setFontStyle('normal');
    doc.setFontSize(16);
    doc.text('Education', 250, ycursor, {align: "left"});
    ycursor += headerspace;

    doc.setFont('mesmerize-el');
    doc.setFontSize(10);
    for (var i=0; i < EducationText.length; i++){
        doc.text(EducationText[i], 260, ycursor, {maxWidth: 320, align: "left"});
        ycursor += 12;
    };

    return ycursor;
}

function AddGenerationDate(doc) {
    DateText = 'Resume Generated on '+GetGenerationDate()+'\n This content is updated dynamically. Visit https://'+GetProfileURL()+' to generate a fresh copy.'

    doc.setTextColor(51, 60, 67);
    doc.setFont('mesmerize-el');
    doc.setFontStyle('normal');
    doc.setFontSize(8);
    PDFSetPage(doc, doc.pagecount);
    doc.text(DateText, doc.internal.pageSize.width-5, doc.internal.pageSize.height-12, {align: "right", url:GetProfileURL()});
};

function AddSkills(doc, ActiveSkillSets, ycursor, headerspace){
    console.log('AddSkills');
    console.log(ActiveSkillSets);
    
    var SkillCategories = GetSkillCategories();

    doc.setTextColor(255, 255, 255);
    for (var c = 0; c < SkillCategories.length; c++) {
        var category = SkillCategories[c];
        var skills = ActiveSkillSets[category];
        
        if (ycursor >= 760){
            ycursor = 20;
            PDFAddPage(doc);
        };

        doc.setFont('mesmerize-rg');
        doc.setFontSize(12);
        doc.text(category, 141, ycursor, {maxWidth: 156, align: "center"});
        ycursor += 12; //lineheight
        ycursor += 5; //margin

        for (var s = 0; s < skills.length; s++){
            var skill = skills[s];
            doc.setFont('mesmerize-el');
            var fontsize = 10;
            doc.setFontSize(fontsize);
            if (Math.ceil(doc.getTextWidth(skill['title']) / 100) > 1){
                fontsize = 9;
                doc.setFontSize(fontsize);
            };
            
            doc.text(skill['title'], 65, ycursor, {maxWidth: 100, align: "left"});
            //doc.textWithLink(skill['title'], 65, ycursor, {maxWidth: 100, align: "left", url:GetProfileURL()+'/Favorites/Bookmarks#'+skill['title']});
            AddStars(doc, skill['proficiency'], ycursor);
            ycursor += Math.round(Math.ceil(doc.getTextWidth(skill['title']) / 100) * fontsize); //lineheight
            ycursor += 2; //margin
            if (ycursor > 780){
                ycursor = 20;
                PDFAddPage(doc);
            };
        };

        //doc.setFillColor(240, 240, 240);
        //doc.rect(60, ycursor, 156, 1, 'F'); //DividingLine

        ycursor += 10; //margin
        if (ycursor > 780){
            ycursor = 20;
            PDFAddPage(doc);
        };
    };

    return ycursor;
}

function AddStars(doc, proficiency, ycursor){
    var percent = parseInt(proficiency);
    for (var i=0; i<5; i++){
        if (percent >= i * 20 - 5 + 20){
            window.FullStarImageCache.push([doc.currentpage, 'PNG', 166+10*i, ycursor-10, 10, 10, {}]);
        } else if (percent >= i * 20 - 15 + 20){
            window.HalfStarImageCache.push([doc.currentpage, 'PNG', 166+10*i, ycursor-10, 10, 10, {}]);
        } else {
            window.EmptyStarImageCache.push([doc.currentpage, 'PNG', 166+10*i, ycursor-10, 10, 10, {}]);
        };
    };
};

function AddProjects(doc, ActiveProjectsData, ImageData) {
    var ImageYPosition = 220;
    var ProjectCounter = 1;
    
    for (var i = 0; i < window.Projects.length; i++) {
        if (ProjectCounter >= 5 && window.Projects.length > i+1) {
            ProjectCounter = 0;
            ImageYPosition = 78;
            PDFAddPage(doc);
        };
        doc.setFontStyle('bold');
        doc.setFontSize(16);
        doc.drawText(201, ImageYPosition+10, '.'+window.Projects[i]["title"]);
        doc.setFontStyle('normal');
        doc.setFontSize(10);
        doc.drawText(206, ImageYPosition+20, window.Projects[i]["date"]);
        doc.setFontSize(16);
        for (var j = 0; j < window.Projects[i]["shortdescription"].length; j++) {
            var descriptiontext = window.Projects[i]["shortdescription"][j];
            descriptiontext = descriptiontext.replaceAll('\n', '');
            descriptiontext = descriptiontext.replaceAll('\r', '');
            doc.drawText(201, ImageYPosition+18+20*(j+1), descriptiontext);
        };

        if(window.Projects[i]['images'].length > 0){
            var imgPath = window.Projects[i]['images'][0];
            var imgData = getBase64FromImageUrl(imgPath);
            if (window.Projects[i]['images'][0].rsplit('.',1)[-1] == 'jpg'){
                doc.addImage(imgData, 'JPEG', 1, ImageYPosition, 178, 100);
            } else if(window.Projects[i]['images'][0].rsplit('.',1)[-1] == 'png'){
                doc.addImage(imgData, 'PNG', 1, ImageYPosition, 178, 100);
            } else {
                doc.addImage(imgData, 'GIF', 1, ImageYPosition, 178, 100);
            };
        };
        ImageYPosition += 142;
        ProjectCounter += 1;
    };
}

function AddImages(doc) {
    for (var i = 0; i < window.PDFImageCache.length; i++) {
        var image = window.PDFImageCache[i];
        image.push(document.createElement('img'));
        image[7].src = image[0];
        image[7].style = 'display:none;';
    };
    for (var i = 0; i < window.PDFImageCache.length; i++) {
        var image = window.PDFImageCache[i];
        doc.addImage(image[7], image[1], image[2], image[3], image[4], image[5]);
        doc.link(image[2], image[3], image[4], image[5], image[6]);
    };

    var FullStarImage = document.createElement('img');
    FullStarImage.src = './About/ResumeImages/FullStar.png';
    FullStarImage.style = 'display:none;';
    var HalfStarImage = document.createElement('img');
    HalfStarImage.src = './About/ResumeImages/HalfStar.png';
    HalfStarImage.style = 'display:none;';
    var EmptyStarImage = document.createElement('img');
    EmptyStarImage.src = './About/ResumeImages/EmptyStar.png';
    EmptyStarImage.style = 'display:none;';
    for (var i = 0; i < window.FullStarImageCache.length; i++) {
        var image = window.FullStarImageCache[i];
        PDFSetPage(doc, image[0]);
        doc.addImage(FullStarImage, image[1], image[2], image[3], image[4], image[5]);
    };
    for (var i = 0; i < window.HalfStarImageCache.length; i++) {
        var image = window.HalfStarImageCache[i];
        PDFSetPage(doc, image[0]);
        doc.addImage(HalfStarImage, image[1], image[2], image[3], image[4], image[5]);
    };
    for (var i = 0; i < window.EmptyStarImageCache.length; i++) {
        var image = window.EmptyStarImageCache[i];
        PDFSetPage(doc, image[0]);
        doc.addImage(EmptyStarImage, image[1], image[2], image[3], image[4], image[5]);
    };
}

function PDFSave(doc, PositionTitle) {
    console.log('PDFSave');
    var date = new Date();
    doc.save('MadisonAster_'+PositionTitle.replaceAll(' ','')+'_Resume_'+date.yyyymmdd()+'.pdf');
}
////////////////////////////////////////////////////


/////////////Keeping for Reference//////////////////
//doc.setFont('helvetica');
//doc.addFont('mesmerize-cd-lt-normal.ttf', 'mesmerize-cd-lt', 'normal');
//doc.setFont('mesmerize-cd-lt');
//doc.addFont('mesmerize-cd-sb-normal.ttf', 'mesmerize-cd-sb', 'normal');
//doc.setFont('mesmerize-cd-sb');
////////////////////////////////////////////////////
