clear
cap clear matrix
cap log close
set more off

/* List names of group members:
Anna Martin 
Foster Burnley 
Griffin Kozlow
Saksham Arora
Sophia Kwon

.do file to generate OLS, FE reg tables, Balance Tests and Table of Means
*/

cd "/Users/sakshamarora/Desktop/STATA_Econ20/Project/" /* fill in the directory where you store the files */
log using "tables.log", replace 
// import delimited "/Users/sakshamarora/Desktop/STATA_Econ20/Project/data_final.csv"
// save participation.dta
use final_init.dta, clear

gen female = (gender==2)
gen white = (race == 8)
gen black = (race == 9)
gen non_white = ethnicity > 8 & race ~= 13
gen hispanic = (ethnicity == 2)
gen other_races = (race >= 10 & race <=12 & ethnicity >= 3)
tab year, gen(yrdum)

gen over_21 = (age >= 21)
gen dad_hgc_pos = dad_hgc if dad_hgc >=0 & dad_hgc < 95
gen mom_hgc_pos = mom_hgc if mom_hgc >= 0 & mom_hgc < 95
gen north_east = region == 1
gen north_central = region == 2
gen south = region == 3
gen west = region == 4
gen age_pos = age if age >= 0

// // OLS regressions 
ssc install outreg2
// 1. drugs_dli, alc_participation, no controls, cluster on pubid, no year effects  
local append “replace”
reg drugs_dli alc_participation_month if drugs_dli >=0 & alc_participation_month >=0, cluster(pubid) robust
test alc_participation_month 
outreg2 using ols_participation.xls, append excel addstat(F-stat,`r(F)',p-value,`r(p)')
local append “append”

// 2. drugs_dli, alc_participation, no controls, cluster on pubid, with year effects  
reg drugs_dli alc_participation_month yrdum* if drugs_dli >=0 & alc_participation_month >=0, cluster(pubid) robust
test alc_participation_month 
outreg2 using ols_participation.xls, append excel addstat(F-stat,`r(F)',p-value,`r(p)')
local append “append”

// 3. drugs_dli, alc_participation, with race and gender controls, cluster on pubid, with year effects  
reg drugs_dli alc_participation_month yrdum* female white black hispanic if drugs_dli >=0 & alc_participation_month >=0, cluster(pubid) robust
test alc_participation_month 
outreg2 using ols_participation.xls, append excel addstat(F-stat,`r(F)',p-value,`r(p)')
local append “append”

// 4. drugs_dli, alc_participation, with race, gender, parent education and region controls, cluster on pubid, with year effects  
reg drugs_dli alc_participation_month yrdum* female white black hispanic dad_hgc_pos mom_hgc_pos north_east north_central south if drugs_dli >=0 & alc_participation_month >=0, cluster(pubid) robust
test alc_participation_month 
outreg2 using ols_participation.xls, append excel addstat(F-stat,`r(F)',p-value,`r(p)')
local append “append”

// FE regressions 
// 1. drugs_dli, alc_participation, no controls, cluster on pubid, no year effects, FE on pubid
local append “replace”
areg drugs_dli alc_participation_month if drugs_dli >=0 & alc_participation_month >=0, absorb(pubid) cluster(pubid) robust
test alc_participation_month 
outreg2 using FE_participation.xls, append excel addstat(F-stat,`r(F)',p-value,`r(p)')
local append “append”

// 2. drugs_dli, alc_participation, no controls, cluster on pubid, with year effects, FE on pubid 
areg drugs_dli alc_participation_month yrdum* if drugs_dli >=0 & alc_participation_month >=0, absorb(pubid) cluster(pubid) robust
test alc_participation_month 
outreg2 using FE_participation.xls, append excel addstat(F-stat,`r(F)',p-value,`r(p)')
local append “append”

// 3. drugs_dli, alc_participation, with race and gender controls, cluster on pubid, with year effects
reg drugs_dli alc_participation_month yrdum* female white black hispanic if drugs_dli >=0 & alc_participation_month >=0, cluster(pubid) robust
test alc_participation_month 
outreg2 using ols_participation.xls, append excel addstat(F-stat,`r(F)',p-value,`r(p)')
local append “append”

// 4. drugs_dli, alc_participation, with race, gender, parent education controls, cluster on pubid, with year effects, FE on region 
areg drugs_dli alc_participation_month yrdum* female white black hispanic dad_hgc_pos mom_hgc_pos if drugs_dli >=0 & alc_participation_month >=0, absorb(region) cluster(pubid) robust
test alc_participation_month 
outreg2 using FE_participation.xls, append excel addstat(F-stat,`r(F)',p-value,`r(p)')
local append “append”

// For initiation variables 
// 1. drugs_init, over_21 dummy, with controls, cluster on pubid, with year effects
local append “replace”
reg drugs_init over_21 yrdum* female white black hispanic dad_hgc_pos mom_hgc_pos north_east north_central south if drugs_init >=0, cluster(pubid) robust
test over_21 
outreg2 using ols_drugs_init.xls, append excel addstat(F-stat,`r(F)',p-value,`r(p)')
local append “append”

local append “replace”
reg alc_init over_21 yrdum* female white black hispanic dad_hgc_pos mom_hgc_pos north_east north_central south if alc_init >=0 , cluster(pubid) robust
test over_21 
outreg2 using ols_alc_init.xls, append excel addstat(F-stat,`r(F)',p-value,`r(p)')
local append “append”

local append “replace”
reg alc_participation_month over_21 yrdum* female white black hispanic dad_hgc_pos mom_hgc_pos north_east north_central south if alc_participation_month >=0 , cluster(pubid) robust
test over_21 
outreg2 using ols_First_stage.xls, append excel addstat(F-stat,`r(F)',p-value,`r(p)')
local append “append”


ssc install outsum	

outsum age_pos white black hispanic female dad_hgc_pos mom_hgc_pos north_east north_central south west using means.csv, comma append bracket ctitle("Overall") nol

outsum age_pos white black hispanic female dad_hgc_pos mom_hgc_pos north_east north_central south west if drugs_dli>=0 & alc_participation_month>=0 using means.csv, comma append bracket ctitle(“Demographics”) nol

outsum age_pos white black hispanic female dad_hgc_pos mom_hgc_pos north_east north_central south west if alc_participation_month>=0 using means.csv, comma append bracket ctitle(“Demographics”) nol

outsum age_pos white black hispanic female dad_hgc_pos mom_hgc_pos north_east north_central south west if alc_init>=0 using means.csv, comma append bracket ctitle(“Demographics”) nol

outsum age_pos white black hispanic female dad_hgc_pos mom_hgc_pos north_east north_central south west if drugs_init>=0 using means.csv, comma append bracket ctitle(“Demographics”) nol


outsum age_pos white black hispanic female dad_hgc_pos mom_hgc_pos north_east north_central south west if alc_init>=0 & drugs_init>=0 using means.csv, comma append bracket ctitle(“Demographics”) nol


cap log close
