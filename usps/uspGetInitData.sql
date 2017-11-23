DELIMITER $$

DROP PROCEDURE IF EXISTS `applicationdb`.`uspGetInitData` $$
CREATE PROCEDURE `applicationdb`.`uspGetInitData`(
IN $p_uCount INT
)
BEGIN

    SELECT count(*) as totalmodels from tblcatmodel tcm group by tcm.ucatid order by tcm.ucatid;

    select * from tblmodels TM JOIN
    (
    select * from
  (
    select ucatid,umodelid, strcatname, @student:= IF(@class <> ucatid, 0, @student + 1) AS rn,
    @class:= ucatid AS clset
    FROM
    (
      select TC.ucatid, TC.strcatname, TCM.umodelid, (SELECT @student := 0), (SELECT @class := 0)
      FROM tblcategories TC
      join tblcatmodel TCM ON TC.ucatid =  TCM.ucatid
      ORDER BY TC.ucatid
    ) t
  ) t2
  where rn < $p_uCount
  )t3
  where t3.umodelid = TM.umodelid;

END $$

DELIMITER ;
