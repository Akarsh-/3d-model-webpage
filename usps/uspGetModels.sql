DELIMITER $$

DROP PROCEDURE IF EXISTS `applicationdb`.`uspGetModels` $$
CREATE PROCEDURE `applicationdb`.`uspGetModels` (
IN $p_uCatId INT UNSIGNED,
IN $p_uStartId INT UNSIGNED,
IN $p_uCount INT UNSIGNED
)
BEGIN

  DECLARE $m_totalCount INT;
  SET $m_totalCount = (SELECT count(*) from tblcatmodel where ucatid = $p_uCatId);

  IF $m_totalCount < $p_uStartId + $p_uCount THEN
    SELECT 0 as morerows;
  ELSE
    SELECT 1 as morerows;
  END IF;

  SELECT M.strmodelname as name,M.strmodelthumb as thumb, M.strmodelobj as obj, M.strmodelmtl as mtl
  FROM tblcatmodel CM
  JOIN tblmodels M ON M.umodelid = CM.umodelid
  WHERE CM.ucatid = $p_ucatid
  LIMIT $p_uStartId, $p_uCount;

END $$

DELIMITER ;