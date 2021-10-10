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
cd file for the Balance Test on participation variables
*/

cd "/Users/sakshamarora/Desktop/STATA_Econ20/Project/" /* fill in the directory where you store the files */
log using "participation.log", replace 
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

areg drugs_dli alc_participation_month yrdum* if drugs_dli >= 0 & alc_participation_month >= 0, absorb(pubid) cluster(pubid)

gen over_21 = (age >= 21)
gen dad_hgc_pos = dad_hgc if dad_hgc >=0 & dad_hgc < 95
gen mom_hgc_pos = mom_hgc if mom_hgc >= 0 & mom_hgc < 95
gen north_east = region == 1
gen north_central = region == 2
gen south = region == 3
gen west = region == 4

// areg alc_participation_month over_21 yrdum* if alc_participation_month >= 0, absorb(pubid) cluster(pubid)

// areg smoking_month over_21 yrdum* if smoking_month >= 0, absorb(pubid) cluster(pubid)

// areg mar_month over_21 yrdum* if mar_month >= 0, absorb(pubid) cluster(pubid)
// egen alc_mean = mean(alc_participation_month), by(pubid)

// reg alc_mean age if over_21==1
// predict yhat1 if e(sample)
// reg alc_mean age if over_21==0
// predict yhat0 if e(sample)

// twoway (scatter alc_mean age if over_21 == 1) (line yhat1 age if over_21 ==1) || ///
// (scatter alc_mean age if over_21 ==0) (line yhat0 age if over_21 ==0), ///
// ylabel(0 1) xline(0) legend(off) graphregion(fcolor(white))
ssc install outreg2

// reg alc_participation_month female age white black hispanic if alc_participation_month >=0, cluster(pubid)
// test female age white black hispanic
// outreg2 using balance.xlsx, replace excel

local append “replace”
foreach var in female age white black hispanic dad_hgc_pos mom_hgc_pos north_east north_central south {
  reg `var' alc_participation_month if alc_participation_month>=0, cluster(pubid)
  test alc_participation_month
  outreg2 using alc.xls, append excel noaster addstat(F-stat,`r(F)',p-value,`r(p)')
  local append “append”
}

local append “replace”
foreach var in female age white black hispanic dad_hgc_pos mom_hgc_pos north_east north_central south {
  reg `var' alc_init if alc_init>=0, cluster(pubid)
  test alc_init
  outreg2 using alc_init.xls, append excel noaster addstat(F-stat,`r(F)',p-value,`r(p)')
  local append “append”
}

local append “replace”
foreach var in female age white black hispanic dad_hgc_pos mom_hgc_pos north_east north_central south {
  reg `var' drugs_dli if drugs_dli>=0 & alc_participation_month>=0, cluster(pubid)
  test drugs_dli
  outreg2 using drugs.xls, append excel noaster addstat(F-stat,`r(F)',p-value,`r(p)')
  local append “append”
}


local append “replace”
foreach var in female age white black hispanic dad_hgc_pos mom_hgc_pos north_east north_central south {
  reg `var' drugs_init if drugs_init>=0 & alc_init>=0, cluster(pubid)
  test drugs_init
  outreg2 using drugs_init.xls, append excel noaster addstat(F-stat,`r(F)',p-value,`r(p)')
  local append “append”
}

local append “replace”
foreach var in female age white black hispanic dad_hgc_pos mom_hgc_pos north_east north_central south {
  reg `var' mar_month if mar_month>=0 & alc_participation_month>=0, cluster(pubid)
  test mar_month
  outreg2 using mar.xls, append excel noaster addstat(F-stat,`r(F)',p-value,`r(p)')
  local append “append”
}

local append “replace”
foreach var in female age white black hispanic dad_hgc_pos mom_hgc_pos north_east north_central south {
  reg `var' mar_init if mar_init>=0 & alc_init>=0, cluster(pubid)
  test mar_init
  outreg2 using mar_init.xls, append excel noaster addstat(F-stat,`r(F)',p-value,`r(p)')
  local append “append”
}

local append “replace”
foreach var in female age white black hispanic dad_hgc_pos mom_hgc_pos north_east north_central south {
  reg `var' smoking_month if smoking_month>=0 & alc_participation_month>=0, cluster(pubid)
  test smoking_month
  outreg2 using smoke.xls, append excel noaster addstat(F-stat,`r(F)',p-value,`r(p)')
  local append “append”
}

gen smoke_init_real = real(smoke_init)
local append “replace”
foreach var in female age white black hispanic dad_hgc_pos mom_hgc_pos north_east north_central south {
  reg `var' smoke_init_real if smoke_init_real >= 0 & alc_init>=0, cluster(pubid)
  test smoke_init_real
  outreg2 using smoke_init.xls, append excel noaster addstat(F-stat,`r(F)',p-value,`r(p)')
  local append “append”
}



// gen alc_pos = alc_participation_month if alc_participation_month >= 0 
// gen drugs_pos = drugs_dli if drugs_dli >= 0 
// gen mar_pos = mar_month if mar_month >= 0 
// gen smoke_pos = smoking_month if smoking_month >= 0 

// gen alc_pos_i = alc_init if alc_init >= 0


// areg drugs_dli alc_participation_month female age other_races black hispanic yrdum* if drugs_dli >= 0  & alc_participation_month >= 0, absorb(pubid) cluster(pubid)

// ivreg mar_month (smoking_month = over_21) female age other_races black hispanic yrdum* if smoking_month >= 0  & mar_month >= 0,  cluster(pubid)

// reg alc_participation_month over_21 female age other_races black hispanic yrdum* if alc_participation_month >= 0 ,  cluster(pubid)

// reg smoking_month over_21 female age other_races black hispanic yrdum* if smoking_month >= 0 ,  cluster(pubid)

// reg mar_month over_21 female age other_races black hispanic yrdum* if mar_month >= 0 ,  cluster(pubid)

// reg drugs_dli over_21 female age other_races black hispanic yrdum* if drugs_dli >= 0 ,  cluster(pubid)

// reg drugs_dli alc_participation_month yrdum* if alc_participation_month >= 0 & drugs_dli >= 0, cluster(pubid)

// outsum  using means.csv, comma replace bracket ctitle(“Overall”) nol

// outsum ever_alc ever_drugs ever_mar age_alc age_drugs age_mar if female==1 using means.csv, comma append  bracket ctitle(“Women”) nol

// outsum ever_alc ever_drugs ever_mar age_alc age_drugs age_mar if female==0 using means.csv, comma append bracket ctitle(“Men”) nol

// outsum ever_alc ever_drugs ever_mar age_alc age_drugs age_mar if white==1 using means.csv, comma append bracket ctitle(“White”) nol

// outsum ever_alc ever_drugs ever_mar age_alc age_drugs age_mar if non_white==1 using means.csv, comma append bracket ctitle(“Non-White”) nol

// outsum ever_alc ever_drugs ever_mar age_alc age_drugs age_mar if black==1 using means.csv, comma append bracket ctitle(“Black”) nol

// outsum ever_alc ever_drugs ever_mar age_alc age_drugs age_mar if hispanic==1 using means.csv, comma append bracket ctitle(“Hispanic”) nol



cap log close
