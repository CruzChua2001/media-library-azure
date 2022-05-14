CREATE TABLE [dbo].[AllActivity] (
    [Id]           INT          NOT NULL,
    [ActivityType] VARCHAR (50) NULL,
    PRIMARY KEY CLUSTERED ([Id] ASC)
);

CREATE TABLE [dbo].[DashboardActivity] (
    [Id]               CHAR (50)     NOT NULL,
    [FileId]           VARCHAR (255) NULL,
    [Email]            VARCHAR (255) NULL,
    [ActivityDateTime] DATETIME      NULL,
    [Activity]         VARCHAR (50)  NULL,
    PRIMARY KEY CLUSTERED ([Id] ASC)
);

CREATE TABLE [dbo].[FileDetails] (
    [Id]        VARCHAR (100)     NOT NULL,
    [FileId]    VARCHAR (100)     NULL,
    [FileSize]  DECIMAL (18, 2)   NULL,
    [AreaPoint] [sys].[geography] NULL,
    PRIMARY KEY CLUSTERED ([Id] ASC)
);

CREATE TABLE [dbo].[PlanningArea] (
    [Id]               INT               NOT NULL,
    [AreaPolygon]      [sys].[geography] NULL,
    [PlanningAreaName] VARCHAR (100)     NULL,
    [RegionId]         INT               NULL,
    PRIMARY KEY CLUSTERED ([Id] ASC)
);

CREATE TABLE [dbo].[Region] (
    [Id]         INT       NOT NULL,
    [RegionName] CHAR (50) NULL,
    PRIMARY KEY CLUSTERED ([Id] ASC)
);

