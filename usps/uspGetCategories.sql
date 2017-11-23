DELIMITER $$

DROP PROCEDURE IF EXISTS `applicationdb`.`uspGetCategories` $$
CREATE PROCEDURE `applicationdb`.`uspGetCategories`(
 IN $p_nCount INT
)
BEGIN
  SELECT * FROM tblcategories tc ORDER BY  tc.ucatid;
END $$

DELIMITER ;