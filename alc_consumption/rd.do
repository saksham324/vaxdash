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

do File to generate RD tables and graphs
*/



cd "/Users/sakshamarora/Desktop/STATA_Econ20/Project/" /* fill in the directory where you store the files */
log using "rd.log", replace 
// import delimited "/Users/sakshamarora/Desktop/STATA_Econ20/Project/final_w_init.csv"
// save final_init.dta
use final_init.dta, clear


gen drugs_init_20 = drugs_init * 20
gen alc_init_20 = alc_init * 20
gen age_pos = age if age >= 0
gen female = (gender==2)
gen white = (race == 8)
gen black = (race == 9)
gen non_white = ethnicity > 8 & race ~= 13
gen hispanic = (ethnicity == 2)
gen other_races = (race >= 10 & race <=12 & ethnicity >= 3)
gen age_narrow = age if age >= 18 & age <= 25
gen over_21 = age_pos >= 21
gen over_20 = age_pos >= 20
gen over_22 = age_pos >= 22
gen alc_init_pos = alc_init if alc_init >= 0 
gen drugs_init_pos = drugs_init_20 if drugs_init_20 >= 0
gen age2 = age_pos^2
gen age3 = age_pos^3 
gen dad_hgc_pos = dad_hgc if dad_hgc >=0 & dad_hgc < 95
gen mom_hgc_pos = mom_hgc if mom_hgc >= 0 & mom_hgc < 95
gen north_east = region == 1
gen north_central = region == 2
gen south = region == 3
gen west = region == 4
gen age4 = age_pos^4
gen age_alc = age_pos * alc_init_pos 
gen age2_alc = age2 * alc_init_pos 
gen age3_alc = age3 * alc_init_pos 
gen age4_alc = age4 * alc_init_pos
gen age_drug = age_pos * alc_init_pos 
gen age2_drug = age2 * drugs_init_pos 
gen age3_drug = age3 * drugs_init_pos 
gen age4_drug = age4 * drugs_init_pos
tab year, gen(yrdum)

// Generating rd model for drug participation
// rdplot drugs_init_pos age_pos if drugs_init_pos >= 0, c(21) vce(cluster pubid) genvars

// reg rdplot_mean_y age_pos age2 age3 age4 age_drug age2_drug age3_drug age4_drug female white black hispanic dad_hgc mom_hgc north_east north_central south yrdum* if over_21 ==1, cluster(pubid)
// predict drughat1 if e(sample)
// reg rdplot_mean_y age_pos age2 age3 age4 age_drug age2_drug age3_drug age4_drug female white black hispanic dad_hgc mom_hgc north_east north_central south yrdum* if over_21 ==0, cluster(pubid)
// predict drughat0 if e(sample)

// scatter rdplot_mean_y age_pos, msize(tiny) xline(21) xtitle("age on day of interview (years)") ///
// ytitle("drug participation (percent x 20)") title("Hard Drug Frequency") || ///
// line drughat1 age_pos if over_21 ==1, sort color(red) || ///
// line drughat0 age_pos if over_21 ==0, sort color(red) legend(off)
// graph export rd_check_drugs.png, replace

// reg rdplot_mean_y over_21 age_pos age2 age3 age4 age_drug age2_drug age3_drug age4_drug female white black hispanic dad_hgc_pos mom_hgc_pos north_east north_central south yrdum*, cluster(pubid)
// test over_21
// outreg2 using rdplot_drugs.xls, append excel addstat(F-stat,`r(F)',p-value,`r(p)')
// local append “append”

// Generating rd model for alcohol participation 
// rdplot alc_init_pos age_pos, c(21) vce(cluster pubid) genvars

// reg rdplot_mean_y age_pos age2 age3 age4 age_drug age2_drug age3_drug age4_drug female white black hispanic dad_hgc mom_hgc north_east north_central south yrdum* if over_21 ==1, cluster(pubid)
// predict alchat1 if e(sample)
// reg rdplot_mean_y age_pos age2 age3 age4 age_drug age2_drug age3_drug age4_drug female white black hispanic dad_hgc mom_hgc north_east north_central south yrdum* if over_21 ==0, cluster(pubid)
// predict alchat0 if e(sample)

// scatter rdplot_mean_y age_pos, msize(tiny) xline(21) xtitle("age on day of interview (years)") ///
// ytitle("drug participation (percent x 20)") title("Hard Drug Frequency") || ///
// line alchat1 age_pos if over_21 ==1, sort color(red) || ///
// line alchat0 age_pos if over_21 ==0, sort color(red) legend(off)
// graph export rd_check_drugs.png, replace

// reg rdplot_mean_y over_21 age_pos age2 age3 age4 age_drug age2_drug age3_drug age4_drug female white black hispanic dad_hgc_pos mom_hgc_pos north_east north_central south yrdum*, cluster(pubid)
// test over_21
// outreg2 using rdplot_alc.xls, append excel addstat(F-stat,`r(F)',p-value,`r(p)')
// local append “append”

// Generating rd table for threshold at age 20 for robustness check 
// Generating rd model for drug participation
// rdplot drugs_init_pos age_pos if drugs_init_pos >= 0, c(20) vce(cluster pubid) genvars

// reg rdplot_mean_y age_pos age2 age3 age4 female white black hispanic dad_hgc mom_hgc yrdum* if over_20 ==1, cluster(pubid)
// predict drughat1 if e(sample)
// reg rdplot_mean_y age_pos age2 age3 age4 female white black hispanic dad_hgc mom_hgc yrdum* if over_20 ==0, cluster(pubid)
// predict drughat0 if e(sample)

// scatter rdplot_mean_y age_pos, msize(tiny) xline(20) xtitle("age on day of interview") ///
// ytitle("drug participation (percent x 20)") || ///
// line drughat1 age_pos if over_20 ==1, sort color(red) || ///
// line drughat0 age_pos if over_20 ==0, sort color(red) legend(off)
// graph export rd_drugs_20.png, replace

// reg rdplot_mean_y over_22 age_pos age2 age3 age4 age_drug age2_drug age3_drug age4_drug female white black hispanic dad_hgc_pos mom_hgc_pos north_east north_central south yrdum*, cluster(pubid)
// test over_22
// outreg2 using rdplot_drugs_22.xls, append excel addstat(F-stat,`r(F)',p-value,`r(p)')
// local append “append”

// Generating rd table for threshold at age 20 for robustness check 

// Generating rd model for alcohol participation 

// rdplot alc_init_pos age_pos, c(22) vce(cluster pubid) genvars

// reg rdplot_mean_y age_pos age2 age3 age4 female white black hispanic dad_hgc mom_hgc yrdum* if over_20 ==1, cluster(pubid)
// predict alchat1 if e(sample)
// reg rdplot_mean_y age_pos age2 age3 age4 female white black hispanic dad_hgc mom_hgc yrdum* if over_20 ==0, cluster(pubid)
// predict alchat0 if e(sample)


// reg rdplot_mean_y over_22 age_pos age2 age3 age4 age_drug age2_drug age3_drug age4_drug female white black hispanic dad_hgc_pos mom_hgc_pos north_east north_central south yrdum*, cluster(pubid)
// test over_22
// outreg2 using rdplot_alc_22.xls, append excel addstat(F-stat,`r(F)',p-value,`r(p)')
// local append “append”

// scatter rdplot_mean_y age_pos, msize(tiny) xline(20) xtitle("age on day of interview") ///
// ytitle("alcohol participation (percent)") || ///
// line alchat1 age_pos if over_20 ==1, sort color(red) || ///
// line alchat0 age_pos if over_20 ==0, sort color(red) legend(off)
// graph export rd_alc_20.png, replace

// Generating rd table for threshold at age 22 for robustness check 
// Generating rd model for drug participation

// reg rdplot_mean_y age_pos age2 age3 age4 female white black hispanic dad_hgc mom_hgc yrdum* if over_22 ==1, cluster(pubid)
// predict drughat1 if e(sample)
// reg rdplot_mean_y age_pos age2 age3 age4 female white black hispanic dad_hgc mom_hgc yrdum* if over_22 ==0, cluster(pubid)
// predict drughat0 if e(sample)
// reg rdplot_mean_y over_22 age_pos age2 age3 age4 age_drug age2_drug age3_drug age4_drug female white black hispanic dad_hgc_pos mom_hgc_pos north_east north_central south yrdum*, cluster(pubid)
// test over_22
// outreg2 using rdplot_drugs_22.xls, append excel addstat(F-stat,`r(F)',p-value,`r(p)')
// local append “append”

// scatter rdplot_mean_y age_pos, msize(tiny) xline(22) xtitle("age on day of interview") ///
// ytitle("drug participation (percent x 20)") || ///
// line drughat1 age_pos if over_22 ==1, sort color(red) || ///
// line drughat0 age_pos if over_22 ==0, sort color(red) legend(off)
// graph export rd_drugs_22.png, replace

// Generating rd table for threshold at age 22 for robustness check 
// Generating rd model for alcohol participation 

// rdplot alc_init_pos age_pos, c(22) vce(cluster pubid) genvars

// reg rdplot_mean_y age_pos age2 age3 age4 female white black hispanic dad_hgc mom_hgc yrdum* if over_22 ==1, cluster(pubid)
// predict alchat1 if e(sample)
// reg rdplot_mean_y age_pos age2 age3 age4 female white black hispanic dad_hgc mom_hgc yrdum* if over_22 ==0, cluster(pubid)
// predict alchat0 if e(sample)

// scatter rdplot_mean_y age_pos, msize(tiny) xline(22) xtitle("age on day of interview") ///
// ytitle("alcohol participation (percent)") || ///
// line alchat1 age_pos if over_22 ==1, sort color(red) || ///
// line alchat0 age_pos if over_22 ==0, sort color(red) legend(off)
// graph export rd_alc_22.png, replace

foreach var in female white black hispanic dad_hgc_pos mom_hgc_pos {
  rdplot `var' age_pos, c(21) vce(cluster pubid)
}

// // Generate reg table for alc


cap log close
