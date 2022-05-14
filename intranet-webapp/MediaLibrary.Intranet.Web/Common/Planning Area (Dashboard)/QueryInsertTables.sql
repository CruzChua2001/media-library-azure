INSERT INTO dbo.AllActivity (Id, ActivityType) VALUES
(1, 'View'),
(2, 'Upload'),
(3, 'Download'),
(4, 'Delete'),
(5, 'Edit');

INSERT INTO dbo.Region (Id, RegionName)
VALUES
(1, 'North'),
(2, 'East'),
(3, 'West'),
(4, 'Central'),
(5, 'North-East');


--Insert into PlanningArea with sample.json file

Declare @JSONPlanningArea varchar(max);

SELECT @JSONPlanningArea = BulkColumn
    --Place full path of sample json into empty string
FROM OPENROWSET (BULK '', SINGLE_CLOB) IMPORT
INSERT INTO dbo.PlanningArea
SELECT Id, geography::STPolyFromText(AreaPolygon, 4326) as AreaPolygon, RTRIM(LTRIM(PlanningAreaName)) as PlanningAreaName, RegionId
FROM OPENJSON(@JSONPlanningArea)
WITH (
	[Id] int,
	[AreaPolygon] varchar(max),
	[PlanningAreaName] char(100),
	[RegionId] int
);

Update dbo.PlanningArea
set AreaPolygon = AreaPolygon.ReorientObject()
where AreaPolygon.EnvelopeAngle() > 90;



