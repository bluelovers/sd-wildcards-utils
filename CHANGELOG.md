# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [1.4.1](https://github.com/bluelovers/sd-wildcards-utils/compare/sd-wildcards-utils@1.3.23...sd-wildcards-utils@1.4.1) (2026-01-24)


### BREAKING CHANGES

* 部分內部函式簽名變更，包括 `_checkValue` 新增 options 参數
* 允許使用 '
* add test cases for checking invalid prompts syntax
* add support for expanding forward slash keys into nested YAML maps



### 🐛　Bug Fixes

* test ([e96efb4](https://github.com/bluelovers/sd-wildcards-utils/commit/e96efb47c31a4156293ff54549faf6b908cd0bec))
* update others file content ([8ad5562](https://github.com/bluelovers/sd-wildcards-utils/commit/8ad556296b7de4a9cee58fb5225279b210969a21))
* add test cases for checking invalid prompts syntax ([573b2f9](https://github.com/bluelovers/sd-wildcards-utils/commit/573b2f9dbb0c4d9d6fdb2440b07e7f126f8f7f6f))
* **ci-copy-to-runtime:** update exclusion pattern and suppress debug log ([03d8536](https://github.com/bluelovers/sd-wildcards-utils/commit/03d8536ed3b4b7134d6c8e1e3d66665a039efe08))
* **cosplay-game:** adjust YAML indentation for costume-weapon in mobile config ([6cd6dd4](https://github.com/bluelovers/sd-wildcards-utils/commit/6cd6dd405a3bd724d600b981a5cbcd87b464ea25))
* **data:** correct formatting errors in nuts_dried_fruits section ([f2e0187](https://github.com/bluelovers/sd-wildcards-utils/commit/f2e0187311b3f7f27b7b569abab00aa48f2258b9))
* **valid:** 检测并提示键名中包含零宽字符的情况 ([9daeb09](https://github.com/bluelovers/sd-wildcards-utils/commit/9daeb09f4ac4a0e267af4e573429f353e7356456))


### ✨　Features

* 新增 allowParameterizedTemplatesImmediate 選項與改進 YAML 合併功能 ([c8b73c6](https://github.com/bluelovers/sd-wildcards-utils/commit/c8b73c611f7278727778775f9f3fa16968bc1c09))
* 添加中式婚礼红盖头及相关元素 ([6f73b22](https://github.com/bluelovers/sd-wildcards-utils/commit/6f73b2290d7bf01dabf0544bafcd5b8961ee7af8))
* 添加中式婚礼相关主题和元素 ([785979f](https://github.com/bluelovers/sd-wildcards-utils/commit/785979f2db84ac4be7836b90643876181fd914d4))
* 添加中国古代船舶类型配置 ([7a99c4f](https://github.com/bluelovers/sd-wildcards-utils/commit/7a99c4f2073e946c8c4c1b022ea0e15b45f8e5ee))
* 将船舶相关配置从env-vehicle.yaml迁移到独立文件 ([b78022f](https://github.com/bluelovers/sd-wildcards-utils/commit/b78022f136e1bb2355987e8e69bb0b2eed4a1412))
* 添加种族相关的下肢服装元素配置 ([f46be41](https://github.com/bluelovers/sd-wildcards-utils/commit/f46be4130f6a9a5ec6f530888ed6b4a902781b99))
* 添加城門环境背景配置 ([8d533c5](https://github.com/bluelovers/sd-wildcards-utils/commit/8d533c539620f29a182a514e520355c11fec36ef))
* add horse carriage vehicle configuration to env-vehicle.yaml ([2d4c959](https://github.com/bluelovers/sd-wildcards-utils/commit/2d4c9594e2c198a721f99643b5a0197f97576b9e))
* 添加玉米相关食物配置 ([6a5cd35](https://github.com/bluelovers/sd-wildcards-utils/commit/6a5cd354886ae411b549db5993d7cbc2093a8e27))
* Add Japanese Oni clan character configurations ([995741e](https://github.com/bluelovers/sd-wildcards-utils/commit/995741e7e7656124fb51dca7f0e17d34262c3ed7))
* 新增滑雪装、客家土楼、星际飞船动力室等主题配置 ([24a902e](https://github.com/bluelovers/sd-wildcards-utils/commit/24a902e729db71bc2d99b6cd28cb5182c9d817c3))
* 添加主题元素配置 ([11ccd92](https://github.com/bluelovers/sd-wildcards-utils/commit/11ccd927713c538450861e41bb542f7650f0408c))
* add croriin majo no okiniiri cosplay character configuration ([e2dd9c4](https://github.com/bluelovers/sd-wildcards-utils/commit/e2dd9c4af7213b497d191843d878f48d9e975924))
* extend prompt library with fishnet tops/dresses and refrigerator furniture ([ade2405](https://github.com/bluelovers/sd-wildcards-utils/commit/ade2405fad8e214d88a0f7df286c71271e58c28a))
* add Jest CI check-each run configuration for IntelliJ ([52e5a90](https://github.com/bluelovers/sd-wildcards-utils/commit/52e5a905bf18e6f5cb1ea2bd2b79cc359d96c533))
* add Dubai environment section and refactor Middle Eastern area prompts ([a9d96f8](https://github.com/bluelovers/sd-wildcards-utils/commit/a9d96f8e4c6a894ab061c86671bcf6b05fc114b2))
* add spectral costume wildcards and Middle Eastern env-bg data ([5a5c8be](https://github.com/bluelovers/sd-wildcards-utils/commit/5a5c8befab07565e296c781f82a56ec0d34c49a2))
* reorganize costume race files and minor cleanup in expressions ([67be0bc](https://github.com/bluelovers/sd-wildcards-utils/commit/67be0bc8c41fef439b696a80da776986dcfca650))
* add new custom character prompts to scenes showcase ([161e914](https://github.com/bluelovers/sd-wildcards-utils/commit/161e9145ac84befbdf4260147fb0de44dc97170b))
* add chiffon dress theme with prompts and styles ([5bade91](https://github.com/bluelovers/sd-wildcards-utils/commit/5bade913643e1050a2f5e52a237792b1db229002))
* Add cosplay data for Yamato, Supergirl, and Glorious ([18e9edf](https://github.com/bluelovers/sd-wildcards-utils/commit/18e9edf7c7197343435502e033286263e9d23900))
* add zero-width package for regex utilities ([0604ac7](https://github.com/bluelovers/sd-wildcards-utils/commit/0604ac751407bdb78dde5a88eae3efe6d1135468))
* add Ragnania cosplay and new scene prompts ([470d6d0](https://github.com/bluelovers/sd-wildcards-utils/commit/470d6d0f3412d917f6efe61abead85615dc0ee32))
* add Fire Emblem character cosplay definitions ([bbb5c82](https://github.com/bluelovers/sd-wildcards-utils/commit/bbb5c82bc18cbe7ce05e4b48221fa0b8834476ef))
* 添加像素游戏肖像风格并增强万智牌艺术提示 ([15b5d27](https://github.com/bluelovers/sd-wildcards-utils/commit/15b5d27c35de078c897ad572d614a9a39e399060))
* add allowParameterizedTemplatesImmediate option to support immediate flag in templates ([9547f8a](https://github.com/bluelovers/sd-wildcards-utils/commit/9547f8a600d6fbd4f3afc15eefa4ca0d02108552))
* 允許使用 ' ([d7e96a9](https://github.com/bluelovers/sd-wildcards-utils/commit/d7e96a91514334839db111daa5f764f377ca8865))
* add new costume elements and prompts for arm warmers, gloves, and see-through items ([81209f9](https://github.com/bluelovers/sd-wildcards-utils/commit/81209f90a792604fc5ca578deb69a0867872b2f4))
* add sailor moon cosplay and various costume/style enhancements ([33292a8](https://github.com/bluelovers/sd-wildcards-utils/commit/33292a88b49890d8cb167c2168109262393cb819))
* improve YAML node merge with comment adjustments and deprecate specific method ([8444ae7](https://github.com/bluelovers/sd-wildcards-utils/commit/8444ae7747ae90fcae53b0aced70673bf2e6f1fc))
* enhance YAML node merging with comment preservation and scalar handling ([eebf94c](https://github.com/bluelovers/sd-wildcards-utils/commit/eebf94cb1b72b2c4add7824c79a3b6846161de09))
* add _copyMergePairCore for improved pair merging with comment handling ([98aea3c](https://github.com/bluelovers/sd-wildcards-utils/commit/98aea3cdd397cce3c5be96c6a350925984ccd2e4))
* enhance unique sequence item handling with scalar merging with comment ([6443289](https://github.com/bluelovers/sd-wildcards-utils/commit/64432893adcee517247a7ca9149c893fbba8dcec))
* improve wildcard YAML parsing with key comment preservation ([c1e9b49](https://github.com/bluelovers/sd-wildcards-utils/commit/c1e9b49350f8d9057cfb30450f0eb8c2c940bf3e))
* add "dystopian_mythology_fantasy" theme configuration and prompts ([147fddc](https://github.com/bluelovers/sd-wildcards-utils/commit/147fddc99b80d8f7bdcef232e4ae5663faba405b))
* add support for empty space values and improve error messages ([b91a198](https://github.com/bluelovers/sd-wildcards-utils/commit/b91a198be0f3dd51d83d03ae9406b09a616eef4a))
* add support for empty space values and improve error messages ([78c982b](https://github.com/bluelovers/sd-wildcards-utils/commit/78c982b4542859ffb3d8c1013a8bf955d94ae0a5))
* add CI tests for checking wildcards yaml files ([222a1e3](https://github.com/bluelovers/sd-wildcards-utils/commit/222a1e35cb38e2545fe421aa43dcf75a84d72414))
* add group split files configuration and improve code formatting ([6f01f47](https://github.com/bluelovers/sd-wildcards-utils/commit/6f01f47d1acc4415941c0e2657c7b5aef9cd1f5f))
* add expandForwardSlashKeys option to YAML parser config ([b597ca6](https://github.com/bluelovers/sd-wildcards-utils/commit/b597ca67e0fcf72707d115f21c9c6dcee74b4a9d))
* add support for expanding forward slash keys into nested YAML maps ([9cf4fa9](https://github.com/bluelovers/sd-wildcards-utils/commit/9cf4fa99669ad9b94b8b615c0e3e66b8d6e1b56f))
* add stringify yaml tests and improve key validation ([8f8aba0](https://github.com/bluelovers/sd-wildcards-utils/commit/8f8aba0a1500bbd75359e5ef6eb99c882157079c))
* add mine environments and update weapon/race wildcards ([f33c2a8](https://github.com/bluelovers/sd-wildcards-utils/commit/f33c2a839fee49b44f4d7d3ac65d9a135d289da7))
* add new styles, costumes and character prompts ([39e30f2](https://github.com/bluelovers/sd-wildcards-utils/commit/39e30f223dfaf3e2e48a9f38837da1edef2302fa))
* **art-type-game:** add model links and update prompts ([f3b3447](https://github.com/bluelovers/sd-wildcards-utils/commit/f3b3447318f2bd67154122b7ceb81f27af123e6b))
* **char-cosplay:** 新增Genshin Impact角色Nefer的cosplay提示词和场景展示 ([a368b0e](https://github.com/bluelovers/sd-wildcards-utils/commit/a368b0ed140956b4ade1ae474e5c6a87cfc78acd))
* **char-cosplay:** Add sekaiju_no_meikyuu necromancer_4 cosplay prompts and surgical scar elements ([7230ac7](https://github.com/bluelovers/sd-wildcards-utils/commit/7230ac7e12ed87060005747c5261e363581d2289))
* **ci-copy-to-runtime:** exclude additional files from glob patterns ([292a648](https://github.com/bluelovers/sd-wildcards-utils/commit/292a648e20a86d2534ffbb49d7bc2dcce7427e7a))
* **cosplay:** add new characters and improve existing ones ([0460ae9](https://github.com/bluelovers/sd-wildcards-utils/commit/0460ae9d5d6bd7771edd80d049ca61dec4e2d34b))
* **cosplay-data:** 新增ShinMegamiTensei角色cosplay配置及风格元素 ([50a39ee](https://github.com/bluelovers/sd-wildcards-utils/commit/50a39ee947f53de1da82345260da19a772a508fe))
* **cosplay/env:** add Cleopatra cosplay prompts and garden gazebo environment ([c8f943c](https://github.com/bluelovers/sd-wildcards-utils/commit/c8f943cac628308bb346a62c53d6043df65ba63d))
* **costume:** 为crop_top添加新的prompts和costume元素 ([762b1a6](https://github.com/bluelovers/sd-wildcards-utils/commit/762b1a663b17015c30f46d6503e6574799547450))
* **costume-hair:** 新增姫髮型髮型配置 ([27d82bc](https://github.com/bluelovers/sd-wildcards-utils/commit/27d82bc6fadfd73116bcc40515d8f38aebb1214e))
* **data:** add boxing sports and Hindu-Indian environment configurations ([c2104cc](https://github.com/bluelovers/sd-wildcards-utils/commit/c2104cc256bdfe22d1726b8a599195a0da3b1370))
* **data:** 新增ojou-sama姿势和热变形背景描述 ([49f3043](https://github.com/bluelovers/sd-wildcards-utils/commit/49f304305298cf83b092d198632844313573d788))
* **data:** 将火山口湖环境配置移至独立文件 ([6c143e3](https://github.com/bluelovers/sd-wildcards-utils/commit/6c143e3dff7f50fad835b4fbfa5e20c1464a3340))
* **data:** add yami kawaii aesthetic prompts and horror monster girl templates ([162a490](https://github.com/bluelovers/sd-wildcards-utils/commit/162a49026710774096b0ef6f758e59b11682dcd8))
* **data:** add organ-based costume elements and expand environment templates ([bc66d76](https://github.com/bluelovers/sd-wildcards-utils/commit/bc66d7605fcb779232847efe8cfe964b2081333f))
* **data:** add demon horn prompts and expand body costume templates ([0cf9d0e](https://github.com/bluelovers/sd-wildcards-utils/commit/0cf9d0eb40649e271599bd6c47528168937762d7))
* **data:** add playful arm and bowlegged pose templates ([61022d3](https://github.com/bluelovers/sd-wildcards-utils/commit/61022d3afae59430bff57d173604e81d90595316))
* **data:** restructure env-elem to env-bg and expand urban environments ([05b6afd](https://github.com/bluelovers/sd-wildcards-utils/commit/05b6afd0ebf45218fe6d4bbe2e2a0b18999be4c5))
* **data:** add new prompts for scenes, costumes, environments, food, and ruins ([f4e137a](https://github.com/bluelovers/sd-wildcards-utils/commit/f4e137aa7f0d3f7f56b0306391a9c4bd4b41b963))
* **data:** add new style prompts for paper ledger and photo film effects ([4308ffb](https://github.com/bluelovers/sd-wildcards-utils/commit/4308ffb554ab0d5fb3070a35e29b6b9bf71c291b))
* **data:** add new prompts for scenes, weapons, and styles ([da9f9f1](https://github.com/bluelovers/sd-wildcards-utils/commit/da9f9f1c526d57dceb39b293211b030f7199e687))
* **data:** add final fantasy iv enemies and pixel style prompts ([f837693](https://github.com/bluelovers/sd-wildcards-utils/commit/f837693cd9609bb4b29350d35a8f38eb40e194cc))
* **data:** update others subproject ([adb181a](https://github.com/bluelovers/sd-wildcards-utils/commit/adb181ae9c44cca2a79fbc82a4f28bda6124c847))
* **data:** add hydropower plant prompts and update scene showcases ([6adaf04](https://github.com/bluelovers/sd-wildcards-utils/commit/6adaf049ac967951027753a44d3d38124fe6b949))
* **data:** add paper bag over head costume prompts and update fountain prompts ([3ced7b9](https://github.com/bluelovers/sd-wildcards-utils/commit/3ced7b938f5c3b90ee7eb0e1a9c00f4dd4408e0f))
* **data:** add crumbling stucco wall and fountain prompts ([540862f](https://github.com/bluelovers/sd-wildcards-utils/commit/540862f1e235514ba815317cda825f31b64be48b))
* **data:** 更新角色扮演和风格艺术相关的YAML数据文件 ([97d32dd](https://github.com/bluelovers/sd-wildcards-utils/commit/97d32dd7bc47699841bcc155aaa3a338017f44cd))
* **data:** Add matador costume theme and update Spain locations ([6dc67e8](https://github.com/bluelovers/sd-wildcards-utils/commit/6dc67e802b4a52ecb6d7f4f2cadc737a3e352f30))
* **data:** 更新角色扮演和场景相关的YAML数据文件 ([596e04f](https://github.com/bluelovers/sd-wildcards-utils/commit/596e04f45b22c368a50196318e7633ea49aec5e6))
* **env-bg:** add stone wall and tiled roof architectural elements ([2a66492](https://github.com/bluelovers/sd-wildcards-utils/commit/2a66492a1a202eabe2ac80d194604e7bc0bf4c89))
* **env-bg:** 添加城市岛屿型大都會环境背景配置 ([a795744](https://github.com/bluelovers/sd-wildcards-utils/commit/a79574432d80c8b1ac718068b6d7fcc88b6a2210))
* **env-bg:** 更新火山景观相关环境描述并添加火山爆发和岩浆场景 ([589a753](https://github.com/bluelovers/sd-wildcards-utils/commit/589a75301367f8bfa1a0dde3205a75c17da0ccc6))
* **env-bg:** 添加日式贵族女子学校环境配置并调整注释 ([218933f](https://github.com/bluelovers/sd-wildcards-utils/commit/218933f25b1465dfe488a55ea3ae73d73de1b943))
* **env-bg:** 新增橱窗逛街和木制商店的环境背景配置 ([07e744b](https://github.com/bluelovers/sd-wildcards-utils/commit/07e744b2921eb57fbf42a87d29f3be9bc3d6160d))
* **env-bg:** 新增沙漠帐篷环境主题配置 ([8434756](https://github.com/bluelovers/sd-wildcards-utils/commit/8434756dfdf6d4d7c317c582396126cd8143457e))
* **env-bg:** add AzulejoAI model reference and prompt ([83d07fd](https://github.com/bluelovers/sd-wildcards-utils/commit/83d07fd95bd638f8504576ef2eb77214d1980b9d))
* **env-bg:** add messy room background prompts and update post-apocalypse style ([98dcc2d](https://github.com/bluelovers/sd-wildcards-utils/commit/98dcc2d4c4e1ca886bf9bd73991edaf8e5a9cb85))
* **env-bg:** add chimney elements and enhance rusted style ([80862ab](https://github.com/bluelovers/sd-wildcards-utils/commit/80862ab6efa1a2c0349a7896e3dd753b99ea5952))
* **env-config:** 新增landscape环境元素配置 ([d0689bb](https://github.com/bluelovers/sd-wildcards-utils/commit/d0689bbfc7026ee1348e2e7f57cb1cb1f4f1b51b))
* **env-elem:** 新增landscape环境元素配置 ([d7f7dc9](https://github.com/bluelovers/sd-wildcards-utils/commit/d7f7dc937b783a6e41d767dd4a1e7f9118ea5125))
* **prompts:** 新增美元符号unsafe syntax检测机制 ([07483f4](https://github.com/bluelovers/sd-wildcards-utils/commit/07483f4e2ea13354300b5c75c2dc85dc03b3d277))
* **prompts:** 添加新的lazy-wildcards提示和serious-blush表情配置 ([a300218](https://github.com/bluelovers/sd-wildcards-utils/commit/a3002187705dee7fa225463e9faa371448766245))
* **prompts:** 新增厨房场景提示和家具相关提示配置 ([87c552a](https://github.com/bluelovers/sd-wildcards-utils/commit/87c552a2b416e57d633f23ad38808af4c2017202))
* **prompts:** add new prompts and refactor existing ones ([6609bb5](https://github.com/bluelovers/sd-wildcards-utils/commit/6609bb51efee186114f29df6c4be65d4aae4bdf5))
* **samurai-armor:** expand config with kabuto helmet, new wildcards for actions, weapons, and backgrounds ([0ced677](https://github.com/bluelovers/sd-wildcards-utils/commit/0ced6771a44ecd586a7377f76145b9cc3bd172cb))
* **style:** add game icon and equipment prompts ([939df48](https://github.com/bluelovers/sd-wildcards-utils/commit/939df48a306814a36d1971704315d408ddf6c805))
* **style-art:** 更新艺术风格配置，调整chibi-3d位置并添加chibi-gundam-sd风格 ([01912dd](https://github.com/bluelovers/sd-wildcards-utils/commit/01912ddaf59169a44bdd38b26c3d439e640ebcde))
* **theme:** 添加elements-fusion主题配置并扩展contrasting-blue_red主题 ([81f5b84](https://github.com/bluelovers/sd-wildcards-utils/commit/81f5b844990654cff960dc2fc9c39c2a2e8841e4))
* **theme:** 在moment主题中添加新的天空效果关键词 ([8796abe](https://github.com/bluelovers/sd-wildcards-utils/commit/8796abe4eec6d7f1273ca295315395e35955f84f))
* **valid:** enhance isSafeKey validation with more strict rules ([bb57201](https://github.com/bluelovers/sd-wildcards-utils/commit/bb57201986ca90f78aa2d09d1cfa3f5c54a4bb8a))
* **wildcards:** add medieval sewer tunnel and water well environments ([742f8a4](https://github.com/bluelovers/sd-wildcards-utils/commit/742f8a452f4faf9fb99d5f6c580730e0532517ac))
* **wildcards:** add Roman attire, industrial platforms, and urban elements ([350a62b](https://github.com/bluelovers/sd-wildcards-utils/commit/350a62bdcf3a2d317ced8f0103c823b6bf8a5dd9))
* **wildcards:** Add Mongolian costume, sports top, and tree roots-branches data ([1108062](https://github.com/bluelovers/sd-wildcards-utils/commit/11080620b6537e936a8bef7bed099abebd86bd8b))
* **wildcards:** add Whistler_mc lingerie and statement outfit sets ([5636fc1](https://github.com/bluelovers/sd-wildcards-utils/commit/5636fc1273cfe7aa4e2f92cdd5cea52c49fc610d))


### 📦　Code Refactoring

* 将昆虫朋克服装配置移至种族分类目录 ([3429c5a](https://github.com/bluelovers/sd-wildcards-utils/commit/3429c5a43e541a0e59416b162ccb654d64ccf16d))
* reorganize tattoo and costume elements for better structure ([b392a4c](https://github.com/bluelovers/sd-wildcards-utils/commit/b392a4c6c44d7e7c16f4bd2e58f02e9a28500222))
* reorganize style-texture.yaml into dedicated texture directory ([4fad26c](https://github.com/bluelovers/sd-wildcards-utils/commit/4fad26c6726679b4e411a97863c2289b63470011))
* { globSync => globSync2 } ([9046ef5](https://github.com/bluelovers/sd-wildcards-utils/commit/9046ef54bc626e1c8018781fc7a3f08bcc0d740b))
* reorganize node modules into a `node` folder ([644bdd9](https://github.com/bluelovers/sd-wildcards-utils/commit/644bdd94a1c63b9c63a5720cd53d51da4ad204b1))
* refactor and reorganize prompt and path-related utilities ([95a9e77](https://github.com/bluelovers/sd-wildcards-utils/commit/95a9e770cf1768bbf1262675f419f03aa01be9fe))
* reorganize node-related modules and improve comment handling ([3f9590c](https://github.com/bluelovers/sd-wildcards-utils/commit/3f9590c7924396b491c4938c48c5df01f1d3e507))
* split prompt validation logic into separate module ([b9d3722](https://github.com/bluelovers/sd-wildcards-utils/commit/b9d372255a324a498c7958c9cea3a1ffb670ad84))
* **art-type:** move isometric config to game-specific file ([cebbf1d](https://github.com/bluelovers/sd-wildcards-utils/commit/cebbf1d7997d2b1a25b6e90b561c404a4e689a00))
* **art-type:** remove pixel art and vector art style entries from art-type.yaml ([098b8b9](https://github.com/bluelovers/sd-wildcards-utils/commit/098b8b945f05dd58f1977927e2fdacbfea3e732c))
* **data:** 重构env-elem.yaml中manhole-cover的prompts结构和命名 ([bb04d86](https://github.com/bluelovers/sd-wildcards-utils/commit/bb04d86c237570d5f41e46f07e90016390620a2a))
* **data:** remove dirty-street, street-palm_trees, and dirty-alley from env-bg ([a9dae78](https://github.com/bluelovers/sd-wildcards-utils/commit/a9dae7885cf1af313d8ddab9a27a6a6fd32292e1))
* **data:** standardize wing field naming and introduce specialized creative templates ([0c067b7](https://github.com/bluelovers/sd-wildcards-utils/commit/0c067b7ba1275889ad9214aa157be8b8d400bc50))
* **env-bg:** reorganize environment background configurations into structured directories ([854d24d](https://github.com/bluelovers/sd-wildcards-utils/commit/854d24ddac0126a3bfd2948ae2e76ef2337077f4))
* **theme:** move EarthElemental configuration to theme-elements.yaml ([3d84b2a](https://github.com/bluelovers/sd-wildcards-utils/commit/3d84b2a07d38da5f0ea3329534a84931e7f93434))


### 📚　Documentation

* 新增 parseWildcardsYaml 完整文件與更新文檔索引 ([815693d](https://github.com/bluelovers/sd-wildcards-utils/commit/815693d8980acec74992bd4d491f71eb5bc46c4a))
* 更新 README.md 和文檔索引 ([9846071](https://github.com/bluelovers/sd-wildcards-utils/commit/9846071b2be0a80c903d669b12e06bc273263673))
* 新增 YAML 鍵名安全性規則與範例 ([35d17dd](https://github.com/bluelovers/sd-wildcards-utils/commit/35d17ddc01415015fd7b7e88a38cbee4ee4ddd4d))
* 新增 YAML 鍵格式處理規則與範例 ([ce94ff1](https://github.com/bluelovers/sd-wildcards-utils/commit/ce94ff1d8c1b74ba058905650505e0a37c07216a))
* 新增 stringifyWildcardsYamlData 輸出格式說明文件 ([d5e8ee6](https://github.com/bluelovers/sd-wildcards-utils/commit/d5e8ee6f1e6a3e49e817d96b80f79ae0858e6e60))
* 新增 merge-functions.md 文件 ([f5d7c9a](https://github.com/bluelovers/sd-wildcards-utils/commit/f5d7c9ac368ade3c6e029d6ace48d3c784ead949))
* 新增 stringifyWildcardsYamlData 錯誤處理文件 ([c60999a](https://github.com/bluelovers/sd-wildcards-utils/commit/c60999aeb3e0f8fa72d535dd6ff90d036e1e0c50))
* **data:** 为城市环境背景添加怀旧氛围描述 ([03eeec4](https://github.com/bluelovers/sd-wildcards-utils/commit/03eeec4168b1d789eaa724a5ed5ad2af7b223968))
* **env-bg:** 添加石器时代背景相关资源链接和提示词 ([9c42c65](https://github.com/bluelovers/sd-wildcards-utils/commit/9c42c656b3700c0b14059908c3ef974822a5d5d7))


### 💎　Styles

* **data:** 修复YAML文件中Danbooru链接的格式问题 ([9b31adf](https://github.com/bluelovers/sd-wildcards-utils/commit/9b31adfcaf7464242570d6f1dcfe760b6c1be361))
* **data/prompts/scenes-showcase.yaml:** remove trailing space in oni girl prompt under lazy-wildcards ([144c06d](https://github.com/bluelovers/sd-wildcards-utils/commit/144c06d0a01ac9786c104a043864fd0900f0f1f5))


### 🚨　Tests

* update snapshots for new data additions and modifications ([2e8bb05](https://github.com/bluelovers/sd-wildcards-utils/commit/2e8bb053a44d672dbf1e8dec1f675e98528190da))
* update ci-cache and lib-check tests with new data exclusions and indentation fix ([558e9fa](https://github.com/bluelovers/sd-wildcards-utils/commit/558e9fa55da85ec653527791e2443ab35c68f884))
* fix test ([4f9dc3f](https://github.com/bluelovers/sd-wildcards-utils/commit/4f9dc3f55ce173f1330cca137910787c2b05350c))
* add snapshot update flag to lib test command ([9be34d8](https://github.com/bluelovers/sd-wildcards-utils/commit/9be34d87d56e63291410ecbaf236f101b7a575a4))
* **snapshots:** Snapshot tests for wildcard existence checking ([7fb2710](https://github.com/bluelovers/sd-wildcards-utils/commit/7fb2710b84966f7ea35da368a25e67cdb5e34224))
* **snapshots:** Snapshot tests for wildcard existence checking ([5ba4e3d](https://github.com/bluelovers/sd-wildcards-utils/commit/5ba4e3d2113abd8be9f88ef80e78948c307c00bd))


### 🛠　Build System

* update snapshots [skip ci] ([f34020c](https://github.com/bluelovers/sd-wildcards-utils/commit/f34020c82aff115b6f06423f4565e170fa8008a6))
* update build [skip ci] ([49d7dc7](https://github.com/bluelovers/sd-wildcards-utils/commit/49d7dc76915d21f0907bb83fed42fa432f7cfee3))
* update snapshots [skip ci] ([c4702ba](https://github.com/bluelovers/sd-wildcards-utils/commit/c4702bab20d0fbf3e7c61de523642e82f0e7aed5))
* update build [skip ci] ([4ac1c07](https://github.com/bluelovers/sd-wildcards-utils/commit/4ac1c070ef70dbd2bc2db32ccb162154ab95f1a3))
* update snapshots [skip ci] ([2ac2f81](https://github.com/bluelovers/sd-wildcards-utils/commit/2ac2f812a40a022e26bf4a106ae89b28314ceba5))
* update build [skip ci] ([ec1984f](https://github.com/bluelovers/sd-wildcards-utils/commit/ec1984f2a3288e51f3971cc97fd26ae38ad740ae))
* update snapshots [skip ci] ([2042a78](https://github.com/bluelovers/sd-wildcards-utils/commit/2042a78fcaeeb1817fd595418c92654caded2170))
* update build [skip ci] ([ab9a4c1](https://github.com/bluelovers/sd-wildcards-utils/commit/ab9a4c1067358605b5a6cfd746a848a72b55c663))
* update snapshots [skip ci] ([a98059f](https://github.com/bluelovers/sd-wildcards-utils/commit/a98059fe42172610b7d2cc4be0a387de19c39d0f))
* update build [skip ci] ([c106396](https://github.com/bluelovers/sd-wildcards-utils/commit/c106396cae39cfc2366e6d871d69e3f2353d6c04))
* update snapshots [skip ci] ([292d8a7](https://github.com/bluelovers/sd-wildcards-utils/commit/292d8a705eee7ec52898917afe2a70d7f07b7a55))
* update build [skip ci] ([c1129c6](https://github.com/bluelovers/sd-wildcards-utils/commit/c1129c6994d470e6019710f5a217c504c65f89aa))
* update snapshots [skip ci] ([9947bfc](https://github.com/bluelovers/sd-wildcards-utils/commit/9947bfc2077c420fe6716eea40019c8e3c18b814))
* update build [skip ci] ([2fa572d](https://github.com/bluelovers/sd-wildcards-utils/commit/2fa572d8b44cdb723936de83b949508c32eea0df))
* update snapshots [skip ci] ([0028f52](https://github.com/bluelovers/sd-wildcards-utils/commit/0028f52d41063571147a1bd2af2aa05488e92e44))
* update build [skip ci] ([964bd1c](https://github.com/bluelovers/sd-wildcards-utils/commit/964bd1cedee6bca6bc7be800744cc2dd7195c746))
* update snapshots [skip ci] ([af1ac1c](https://github.com/bluelovers/sd-wildcards-utils/commit/af1ac1c3efb2d1abffa9773d836cc6d4351698c8))
* update build [skip ci] ([8f8fd5a](https://github.com/bluelovers/sd-wildcards-utils/commit/8f8fd5aaded42fdc1549367564bee6a030ed3b11))
* update snapshots [skip ci] ([d56d4e9](https://github.com/bluelovers/sd-wildcards-utils/commit/d56d4e96a9070c1633f0302ab2bc279295247e39))
* update build [skip ci] ([c3bad83](https://github.com/bluelovers/sd-wildcards-utils/commit/c3bad832e5b15f7d135298faf1d6048749f33c6b))
* update snapshots [skip ci] ([e12f9dc](https://github.com/bluelovers/sd-wildcards-utils/commit/e12f9dc38e4c7168123c84cdcfa929a139f1e729))
* update build [skip ci] ([fd4cd3b](https://github.com/bluelovers/sd-wildcards-utils/commit/fd4cd3b63c02f33de3aeef2db992fdc14fe61569))
* update snapshots [skip ci] ([b1242b2](https://github.com/bluelovers/sd-wildcards-utils/commit/b1242b2930edef2e83b5a1e13dac1d56de92b140))
* update build [skip ci] ([c6219f4](https://github.com/bluelovers/sd-wildcards-utils/commit/c6219f47f5317f3afa54c834086c7ce6679bfc7b))
* update snapshots [skip ci] ([7ef5716](https://github.com/bluelovers/sd-wildcards-utils/commit/7ef5716826ef1e8174c78cf14f564ee04118ac50))
* update build [skip ci] ([5881b9e](https://github.com/bluelovers/sd-wildcards-utils/commit/5881b9e7fd8478376d599f6ed0571cf3b1554e19))
* update snapshots [skip ci] ([19caa6a](https://github.com/bluelovers/sd-wildcards-utils/commit/19caa6abcff33abf4c4198642c5d29ddfdabcd4c))
* update build [skip ci] ([0e58f38](https://github.com/bluelovers/sd-wildcards-utils/commit/0e58f3889486e1cf497a6a7523eeecca7630e338))
* update snapshots [skip ci] ([c5418f6](https://github.com/bluelovers/sd-wildcards-utils/commit/c5418f6e7cffd3812bbfc5bc69a577d9596fd101))
* update build [skip ci] ([ac7c78b](https://github.com/bluelovers/sd-wildcards-utils/commit/ac7c78bdcc97ece9ad92827bf8623c4fab24cbae))
* update build ([ad7bc67](https://github.com/bluelovers/sd-wildcards-utils/commit/ad7bc67c1305ec2099ca17eecfd4473638638ad4))
* update snapshots [skip ci] ([fc948ed](https://github.com/bluelovers/sd-wildcards-utils/commit/fc948ed69b90c4df12ee53251b091beec904c43a))
* update build [skip ci] ([843c93c](https://github.com/bluelovers/sd-wildcards-utils/commit/843c93c97ea01f7ac82cb1b03e52962a21a87b0b))
* update snapshots [skip ci] ([a7c61bf](https://github.com/bluelovers/sd-wildcards-utils/commit/a7c61bf0e91e3dd6c325cef0640d21743dea1138))
* update build [skip ci] ([7b19531](https://github.com/bluelovers/sd-wildcards-utils/commit/7b19531a753b41cbccbd4de21e786ab19cda4eed))


### ⚙️　Continuous Integration

* update cf data file ([d4f0660](https://github.com/bluelovers/sd-wildcards-utils/commit/d4f0660055550e191006f2b247386607c3bf4897))


### ♻️　Chores

* update .gitignore to exclude test, config, and workflow files ([14c7530](https://github.com/bluelovers/sd-wildcards-utils/commit/14c75308fb533dec3e8e7474b2e46baaab5a1c77))
* update dependencies and devDependencies to latest versions ([c7f8733](https://github.com/bluelovers/sd-wildcards-utils/commit/c7f87337bcaae039a3c29fd33ac263ebbb01d3ab))
* update .aiexclude ([0688346](https://github.com/bluelovers/sd-wildcards-utils/commit/068834643f4a556edadc6e36446da239e03d391c))
* comment out unused bracket extraction logic in _checkBrackets2 ([65e0840](https://github.com/bluelovers/sd-wildcards-utils/commit/65e0840185ec9c0e3c2aa61285bb0074b9e612e9))
* Remove deprecated 'color-anything' block from utils.yaml ([83d9087](https://github.com/bluelovers/sd-wildcards-utils/commit/83d908771168c970bb4d6eb47c60500816582243))
* **data:** move env-wall.yaml to architectural-elem subdirectory ([d45fb85](https://github.com/bluelovers/sd-wildcards-utils/commit/d45fb85c1e9b86d7c9c3fb0dee22520cee8eacd9))
* **data:** 更新子模块 others 到最新提交 ([2aa759b](https://github.com/bluelovers/sd-wildcards-utils/commit/2aa759b36c603b620d1246b074fc7f2cde086daf))
* **data:** 更新子模块others的commit引用 ([fa31085](https://github.com/bluelovers/sd-wildcards-utils/commit/fa31085faf48fba7485898c5b6292a49530303ee))
* **data:** 更新子模块引用到最新提交 ([296a4c4](https://github.com/bluelovers/sd-wildcards-utils/commit/296a4c499ea618b2b3ffb55c6c78a83e7d39d2b1))
* **scripts:** add `globSync2` import to build.ts for utility expansion ([f090891](https://github.com/bluelovers/sd-wildcards-utils/commit/f0908916a3d1e9818d913842b125582841c92210))
* **submodule:** bump data/others to new commit ([4604d8f](https://github.com/bluelovers/sd-wildcards-utils/commit/4604d8fab096855933ba65ccca93f4defd78d3b1))
* **submodule:** update data/others to commit 6aa781d ([a210e5f](https://github.com/bluelovers/sd-wildcards-utils/commit/a210e5f6570d3fe413bf4c0bd30f66b80b9e0d57))
* **submodule:** update data/others to commit e219303 ([f20d9a8](https://github.com/bluelovers/sd-wildcards-utils/commit/f20d9a8df8715b2b94aad49a352816b5d9b017f2))
* **test:** 在设置文件中添加新的忽略模式 ([1d1de12](https://github.com/bluelovers/sd-wildcards-utils/commit/1d1de126a69e6dd4fca87fece024045f479bd79a))
* **test:** 更新测试设置文件中的路径配置 ([9478a42](https://github.com/bluelovers/sd-wildcards-utils/commit/9478a42603c2b567bcd05a4f6312ba80fbc6405c))
* **tests:** add `allowScalarValueIsEmptySpace` option to YAML stringification test ([7de581e](https://github.com/bluelovers/sd-wildcards-utils/commit/7de581e8ab46d84b42ff1c279a2deb08d220c685))
* **wildcards:** fix typos in prompts and update YAML processing in tests ([aa7beca](https://github.com/bluelovers/sd-wildcards-utils/commit/aa7beca0694bf629f0c949a4af81645bddee5d19))
* **wildcards:** update wildcard paths and introduce new weather-mist-smoke and weather-mist-perfume prompts ([a616b0f](https://github.com/bluelovers/sd-wildcards-utils/commit/a616b0ff4e6ed85e0e6187f1f0bcba773d8a9885))
* **wildcards:** add new medieval, gemstone, and tavern-related prompts with detailed costume and environment expansions ([9505d99](https://github.com/bluelovers/sd-wildcards-utils/commit/9505d995a0557c8bc3b94f4266bf0e9acff0f99b))
* **wildcards:** add medieval, craft, and religious costume prompts with expanded elements ([cdc5416](https://github.com/bluelovers/sd-wildcards-utils/commit/cdc541655721ae79bbd2969502f1e97ca07900a6))
* **wildcards:** rename `holstered` to `holster` and expand related prompts for costumes and environments ([53a6162](https://github.com/bluelovers/sd-wildcards-utils/commit/53a616284f9fcbc44977849a74af45d5b12c2e77))
* **wildcards:** add new prompts and expand wildcards for costumes, styles, and environments ([abe5584](https://github.com/bluelovers/sd-wildcards-utils/commit/abe5584a248c94818d3e40bc69d9272662b1e286))
* **wildcards:** rename and reorganize `costume-tattoo` paths to `costume-elem-tattoo` ([6dd8a03](https://github.com/bluelovers/sd-wildcards-utils/commit/6dd8a034af2608e6c1cbb4d3e981bfba5c01845d))
* **wildcards:** add new themes, environments, and prompt categories; update spider-web paths ([8e570cc](https://github.com/bluelovers/sd-wildcards-utils/commit/8e570cc80753af7bd7017acf8e50e4f4381da699))
* **wildcards:** move suitcase-related prompts to a new `bag.yaml` file for better organization ([db0118c](https://github.com/bluelovers/sd-wildcards-utils/commit/db0118cd0d64a6b6e1bb38c76e27da1608509cfc))
* **wildcards:** update paths and add new entries for costumes, environments, and character sets ([e995453](https://github.com/bluelovers/sd-wildcards-utils/commit/e995453fbb6c484baf12371f90fcca9c5c2d511b))


### 🔖　Miscellaneous

* . ([db95f9e](https://github.com/bluelovers/sd-wildcards-utils/commit/db95f9e581f0525cda1aa1c9cfbc6f8efd4d63a6))
* . ([ec506ea](https://github.com/bluelovers/sd-wildcards-utils/commit/ec506ea9ce501efe19a6ae35ab01cf377141f836))
* . ([007b608](https://github.com/bluelovers/sd-wildcards-utils/commit/007b608c3406b425744d9b37ef396c546dd8d453))
* . ([a9bab95](https://github.com/bluelovers/sd-wildcards-utils/commit/a9bab95600ee9818f00deb9c07497988b88db179))
* . ([b4a36ff](https://github.com/bluelovers/sd-wildcards-utils/commit/b4a36ff4ec44846e2df915049606dd67d2be0913))



## [1.3.23](https://github.com/bluelovers/sd-wildcards-utils/compare/sd-wildcards-utils@1.3.22...sd-wildcards-utils@1.3.23) (2025-09-08)



### 🛠　Build System

* update snapshots [skip ci] ([5407885](https://github.com/bluelovers/sd-wildcards-utils/commit/5407885e2fd2cb93ce79235184c3e3c602f8792d))
* update snapshots [skip ci] ([cc844a8](https://github.com/bluelovers/sd-wildcards-utils/commit/cc844a8dd1aef83e80343a4895ad696ce1bf34cc))



## [1.3.22](https://github.com/bluelovers/sd-wildcards-utils/compare/sd-wildcards-utils@1.3.21...sd-wildcards-utils@1.3.22) (2025-09-08)


### BREAKING CHANGES

* enhance wildcards matching and path validation



### ✨　Features

* enhance wildcards matching and path validation ([a725368](https://github.com/bluelovers/sd-wildcards-utils/commit/a725368dff26daa653520afe9dfb9cd34abb8800))
* **tattoo:** add new tattoo types and reorganize tanlines ([897f19b](https://github.com/bluelovers/sd-wildcards-utils/commit/897f19b726fafe2bbd3b08afcf52cac544420201))


### 🛠　Build System

* update snapshots [skip ci] ([a1fc911](https://github.com/bluelovers/sd-wildcards-utils/commit/a1fc9110b692f2a26452ac5ab33d85d7bab5e2a1))
* update build [skip ci] ([343b805](https://github.com/bluelovers/sd-wildcards-utils/commit/343b805e7253a588483d73b1894aedbb0565f227))


### 🔖　Miscellaneous

* . ([1c86076](https://github.com/bluelovers/sd-wildcards-utils/commit/1c860760471942e3acfa556aa73f216a90361eb1))
* . ([2181112](https://github.com/bluelovers/sd-wildcards-utils/commit/2181112c6e39c5503eb752471053839fbe41f4fa))



## [1.3.21](https://github.com/bluelovers/sd-wildcards-utils/compare/sd-wildcards-utils@1.3.12...sd-wildcards-utils@1.3.21) (2025-09-07)


### BREAKING CHANGES

* `__lazy-wildcards/**/fn/**__`
* entryAll
* update data
* update data
* { prompts/costume-with-color => dataset/costume-with-color }
* env-bg-real-world-location
* { prompts-color => prompts-with-color }
* { costume-face => costume-elem-expressions }
* delete others
* remove
* remove
* remove



### 🐛　Bug Fixes

* 修正錯誤的消除提示詞結尾的 `,` ([080a872](https://github.com/bluelovers/sd-wildcards-utils/commit/080a872e33a3841881e13542e38c11d4b42f3957))
* fn ([524f6b2](https://github.com/bluelovers/sd-wildcards-utils/commit/524f6b21897801e7c6423bf71e7ae37b88a6d9bd))
* strip space near `,` ([4ed3d41](https://github.com/bluelovers/sd-wildcards-utils/commit/4ed3d415d943e084fd19ff608a5f39eb55323537))
* strip space near `,` ([fb90182](https://github.com/bluelovers/sd-wildcards-utils/commit/fb90182166e13f6a3a8cc18d8f076c7b9ceba058))
* strip space near `,` ([1cbc5a0](https://github.com/bluelovers/sd-wildcards-utils/commit/1cbc5a00a09ec8ea05e0a256ca0a469a8783701b))
* dy var ([0222c25](https://github.com/bluelovers/sd-wildcards-utils/commit/0222c25aa90e28bb32712ae556dfbf4944d819d7))
* check dy var ([4ab7c88](https://github.com/bluelovers/sd-wildcards-utils/commit/4ab7c8849806d3873220ecc35ec993b28b04049e))
* support nest ([c6d5858](https://github.com/bluelovers/sd-wildcards-utils/commit/c6d5858e786d78107da87d1b9cdb03041f56bf9f))
* trim Dynamic Prompts Variables ([edd4d7d](https://github.com/bluelovers/sd-wildcards-utils/commit/edd4d7d706190e0a182a9902f1987b2e0175ab62))
* trim tab ([0ab3a46](https://github.com/bluelovers/sd-wildcards-utils/commit/0ab3a46d78362fbce6a9408b3616f40db92f6d9a))
* script ([7a323f9](https://github.com/bluelovers/sd-wildcards-utils/commit/7a323f9fe89b4c5041f16c7e33dd4112f704209f))
* `%` ([a7e37f3](https://github.com/bluelovers/sd-wildcards-utils/commit/a7e37f33175bf3b2947cdd8ac2fc42a5fb541eba))
* add check brackets ([cd643b4](https://github.com/bluelovers/sd-wildcards-utils/commit/cd643b45a8dc1bce29988457e7089d17ae293d01))
* RE_UNSAFE_PLAIN ([3af744f](https://github.com/bluelovers/sd-wildcards-utils/commit/3af744f4d0f861a681f9c858d410ccc8789f1e2c))
* wrong setting ([1845972](https://github.com/bluelovers/sd-wildcards-utils/commit/1845972d72694dcafcd452c3c3f76accbb6ea5c7))
* **merge:** support deep merge: level 2 ([f255ec2](https://github.com/bluelovers/sd-wildcards-utils/commit/f255ec2db5da7d3b911624921fbfe72f245bbf27))
* **merge:** fix error merge when single seq ([30b42be](https://github.com/bluelovers/sd-wildcards-utils/commit/30b42beadc47115619e5a0192d8a7ae188057de1))


### ✨　Features

* add trim Dynamic Prompts Variables ([46d32d9](https://github.com/bluelovers/sd-wildcards-utils/commit/46d32d9ecb6cc101b2674c8d45aa46751798dc39))
* add `getNodeTypeSymbol`, `isSameNodeType` ([d4d075e](https://github.com/bluelovers/sd-wildcards-utils/commit/d4d075e3a80bad5c2e60d813015851db027317f3))
* **types:** add `IParseWildcardsYamlInputSource` ([98927a8](https://github.com/bluelovers/sd-wildcards-utils/commit/98927a8d6a280923415bc4038f4429a79888d934))


### 📦　Code Refactoring

* . ([84e93c0](https://github.com/bluelovers/sd-wildcards-utils/commit/84e93c0a982a83d231f04cc48faa85002b403131))
* update script ([08f2ca7](https://github.com/bluelovers/sd-wildcards-utils/commit/08f2ca756c408ec155304f899de9007ce7474cab))
* better message ([8067c3c](https://github.com/bluelovers/sd-wildcards-utils/commit/8067c3c29a42761ef467e787bbf3e237dcb3c081))
* char/haircuts-multis__ => dataset/char-haircuts ([6ace5a5](https://github.com/bluelovers/sd-wildcards-utils/commit/6ace5a5815e6906ab2b91f53b4f9734a0366e33e))
* { prompts/costume-with-color => dataset/costume-with-color } ([855b16f](https://github.com/bluelovers/sd-wildcards-utils/commit/855b16f3b6db814e7b0f0014e2abc25f7893954a))
* env-elem ([e7ed5cd](https://github.com/bluelovers/sd-wildcards-utils/commit/e7ed5cdb0b64d221d4b8a0653b9c3fc4f395330d))
* env-bg-real-world-location ([48c6875](https://github.com/bluelovers/sd-wildcards-utils/commit/48c6875c87b73a0d2b965ffc5b8cee877fd59c62))
* { costume-ethnicity-hair => costume-ethnicity-hair-style } ([dbfd401](https://github.com/bluelovers/sd-wildcards-utils/commit/dbfd401e5f6b4e302eca3bf408175c44bd0717e6))
* { prompts-color => prompts-with-color } ([f87ca94](https://github.com/bluelovers/sd-wildcards-utils/commit/f87ca946831424094e3dfba17675c4049c198b34))
* { costume-face => costume-elem-expressions } ([25c5117](https://github.com/bluelovers/sd-wildcards-utils/commit/25c5117a0284e4a86a05a76d0299c170b588a12f))
* { cosplay-real => real-cosplay } ([0c5fe93](https://github.com/bluelovers/sd-wildcards-utils/commit/0c5fe93ce5275ecc45c402c54309cea36a04f298))
* **build:** update snapshots [skip ci] ([9cd8231](https://github.com/bluelovers/sd-wildcards-utils/commit/9cd8231943c4c7d41f6ace12cb413825c01bd7da))


### 📚　Documentation

* add tg_love ([8429079](https://github.com/bluelovers/sd-wildcards-utils/commit/8429079cb7f25d254860e2d6439978ed21306052))
* update readme ([c1db419](https://github.com/bluelovers/sd-wildcards-utils/commit/c1db419c5720a26ed244d8fdd0bdaed0da4cd7b7))
* update README ([4886a89](https://github.com/bluelovers/sd-wildcards-utils/commit/4886a896564cd24b66c48e372967dd67824e4a27))


### 🚨　Tests

* update test ([f9ba34d](https://github.com/bluelovers/sd-wildcards-utils/commit/f9ba34d8ce925135c28f3a0900a092f292a2a4ee))
* update test ([65c3659](https://github.com/bluelovers/sd-wildcards-utils/commit/65c365972e27870ae1fd7da00d16d116ef8fdf63))
* update test ([84337eb](https://github.com/bluelovers/sd-wildcards-utils/commit/84337eb245fff9186922966aa5c3fdf323187566))


### 🛠　Build System

* update snapshots [skip ci] ([beccf73](https://github.com/bluelovers/sd-wildcards-utils/commit/beccf733ffe8c156df52aac6522808b0b2759225))
* update build [skip ci] ([2d27f95](https://github.com/bluelovers/sd-wildcards-utils/commit/2d27f950ac5a9149ed0a7d339ce26602ca2be90d))
* update snapshots [skip ci] ([49c3053](https://github.com/bluelovers/sd-wildcards-utils/commit/49c30533f370eb392a6522016f1d5cfb524b1a6a))
* update build [skip ci] ([70a8c17](https://github.com/bluelovers/sd-wildcards-utils/commit/70a8c171dc90b26323c4d788094bdbdf5cfaca1a))
* update snapshots [skip ci] ([f046e76](https://github.com/bluelovers/sd-wildcards-utils/commit/f046e76fe1808fa2c279c04ea46e74bc723f0fb2))
* update build [skip ci] ([9c29f7e](https://github.com/bluelovers/sd-wildcards-utils/commit/9c29f7e28e808e8b6a8c8214d2ad36051c65c5ac))
* update snapshots [skip ci] ([68dbac9](https://github.com/bluelovers/sd-wildcards-utils/commit/68dbac99058a69fe35ed44037e56810708276a00))
* update snapshots [skip ci] ([f6743a3](https://github.com/bluelovers/sd-wildcards-utils/commit/f6743a3bb903db0cac0fa59b9a3dca9877a495c7))
* update build [skip ci] ([45e8d42](https://github.com/bluelovers/sd-wildcards-utils/commit/45e8d42e5eb905085732fb70dccefac23c9bbe01))
* update snapshots [skip ci] ([450a4ac](https://github.com/bluelovers/sd-wildcards-utils/commit/450a4aca849a0c8605bd8651d71023f886442509))
* update build [skip ci] ([bb2d3ae](https://github.com/bluelovers/sd-wildcards-utils/commit/bb2d3ae9057c8b51c63570c9392f13c85143ec7a))
* update build [skip ci] ([3a5dc1e](https://github.com/bluelovers/sd-wildcards-utils/commit/3a5dc1ec6c53ed80c70710f32b24bd2429af4923))
* update snapshots [skip ci] ([4b92b4e](https://github.com/bluelovers/sd-wildcards-utils/commit/4b92b4e375743d69683e61b90d4a20732bc44e3c))
* update build [skip ci] ([73da603](https://github.com/bluelovers/sd-wildcards-utils/commit/73da6031bd3c914a5c6e1659859f7bfb322139b3))
* update snapshots [skip ci] ([7d643a7](https://github.com/bluelovers/sd-wildcards-utils/commit/7d643a716b49e3f749d3ebf78b5aa14fe5a8012a))
* update build [skip ci] ([9e8cd8a](https://github.com/bluelovers/sd-wildcards-utils/commit/9e8cd8acc95954414c6c97abf160c8da9400ea9f))
* update snapshots [skip ci] ([975f0ba](https://github.com/bluelovers/sd-wildcards-utils/commit/975f0ba69d195356b8e25734591e2d84cc01a219))
* update build [skip ci] ([a27def1](https://github.com/bluelovers/sd-wildcards-utils/commit/a27def165abda0eb9e8203d5de0cfe07a27f0067))
* update snapshots [skip ci] ([838bdad](https://github.com/bluelovers/sd-wildcards-utils/commit/838bdade47469ba449554c9597794f49cec5f1b3))
* update build [skip ci] ([22fb99c](https://github.com/bluelovers/sd-wildcards-utils/commit/22fb99c410ac31b17467d1e6d608d85b999f8634))
* update snapshots [skip ci] ([f0d45eb](https://github.com/bluelovers/sd-wildcards-utils/commit/f0d45eb9c7b2f39d8a4c1a5e5ebe6735e0710f48))
* update build [skip ci] ([fb396e2](https://github.com/bluelovers/sd-wildcards-utils/commit/fb396e2cf5425ed99b6dfce04af7043e9a1aa619))
* update snapshots [skip ci] ([233ac41](https://github.com/bluelovers/sd-wildcards-utils/commit/233ac41a40f2cc37e5894c5354b6d1d6d01c64ce))
* update build [skip ci] ([768d043](https://github.com/bluelovers/sd-wildcards-utils/commit/768d043a23f9fe82113da3359c6cbce704a9f368))
* update snapshots [skip ci] ([33f4099](https://github.com/bluelovers/sd-wildcards-utils/commit/33f4099a33a2e54e5f37356e727a1c8981624f5b))
* update build [skip ci] ([6d19fad](https://github.com/bluelovers/sd-wildcards-utils/commit/6d19fad4bd6d69d5ed3b600c73b68036f158c7ad))
* update snapshots [skip ci] ([b1c7847](https://github.com/bluelovers/sd-wildcards-utils/commit/b1c7847275610254eb3a28ede5eeaf5ad28b17b4))
* update build [skip ci] ([b63aaeb](https://github.com/bluelovers/sd-wildcards-utils/commit/b63aaeb7261f78b487daa151f0b6b658c084cca0))
* update snapshots [skip ci] ([c570e63](https://github.com/bluelovers/sd-wildcards-utils/commit/c570e637162ca0496a5f8fed4e65d7937ae51436))
* update build [skip ci] ([983b933](https://github.com/bluelovers/sd-wildcards-utils/commit/983b93381f2bf1047eb78002e8abfe50068c66f8))
* update snapshots [skip ci] ([98d912b](https://github.com/bluelovers/sd-wildcards-utils/commit/98d912ba9a1b012474940c35af837eab42b2d509))
* update build [skip ci] ([12f3f24](https://github.com/bluelovers/sd-wildcards-utils/commit/12f3f24c3fbdd373c3fa0f088dbdd540b1578106))
* update snapshots [skip ci] ([93f2ccb](https://github.com/bluelovers/sd-wildcards-utils/commit/93f2ccb563f9ccb238bef1a34dd710b3751d5fc9))
* update build [skip ci] ([7411080](https://github.com/bluelovers/sd-wildcards-utils/commit/741108082505fea56cdcd784f08caed954f8d0be))
* update snapshots [skip ci] ([2b9d719](https://github.com/bluelovers/sd-wildcards-utils/commit/2b9d7193662913c12d7222eea23b67edabe94acc))
* update build [skip ci] ([7d5b725](https://github.com/bluelovers/sd-wildcards-utils/commit/7d5b7251c4b00765f04f8100ece81607cf6104d8))
* update snapshots [skip ci] ([786c178](https://github.com/bluelovers/sd-wildcards-utils/commit/786c178926938077a63f10fcf5bae621e094c98e))
* update build [skip ci] ([fa64641](https://github.com/bluelovers/sd-wildcards-utils/commit/fa64641aecd17ff00bd5f49c7af1e40fe05d4d5a))
* update snapshots [skip ci] ([73b5134](https://github.com/bluelovers/sd-wildcards-utils/commit/73b5134add0ae4308d0a2eedfbac8552729d161a))
* update build [skip ci] ([29c3de8](https://github.com/bluelovers/sd-wildcards-utils/commit/29c3de817a19ec51da3e20ca6875447aae7a696c))
* update data ([2c3f541](https://github.com/bluelovers/sd-wildcards-utils/commit/2c3f541c966c058e06a2fad03ee8d5e57b6ccb4f))
* update data ([c2e1c18](https://github.com/bluelovers/sd-wildcards-utils/commit/c2e1c182fbf2074058d8381b25c379a424d2a6d1))
* update snapshots [skip ci] ([f1583ff](https://github.com/bluelovers/sd-wildcards-utils/commit/f1583ff1e82754aec64f001da82a38565446f123))
* update snapshots [skip ci] ([3b1d6e6](https://github.com/bluelovers/sd-wildcards-utils/commit/3b1d6e606408c6cffd0d55d3b8486b14c17bc294))
* update build [skip ci] ([abc5df6](https://github.com/bluelovers/sd-wildcards-utils/commit/abc5df662adc1b5207bd97c8a4f9556735921f6a))
* update snapshots [skip ci] ([98d8a5c](https://github.com/bluelovers/sd-wildcards-utils/commit/98d8a5c1e490887045fb9ce97770c5a7404f1fe6))
* update build [skip ci] ([d4065ca](https://github.com/bluelovers/sd-wildcards-utils/commit/d4065cab2f3d3d63171cd5fde774939170323276))
* update snapshots [skip ci] ([a37b12a](https://github.com/bluelovers/sd-wildcards-utils/commit/a37b12a0470f6e454abeeb7eaf5c4588f77e8923))
* update build [skip ci] ([62c797e](https://github.com/bluelovers/sd-wildcards-utils/commit/62c797e0f82a1f834356a5871323ea5353a15298))
* update snapshots [skip ci] ([f2c0d47](https://github.com/bluelovers/sd-wildcards-utils/commit/f2c0d472662a9437f4379f3458141462b2c94c93))
* update build ([c12d6ed](https://github.com/bluelovers/sd-wildcards-utils/commit/c12d6ed3d5ae049876b0b1598a973ce64b98a95c))
* update snapshots [skip ci] ([e9dc2d7](https://github.com/bluelovers/sd-wildcards-utils/commit/e9dc2d7eb4d63b1ad532a46eb96c0668d4bfc95b))
* update build ([fc20583](https://github.com/bluelovers/sd-wildcards-utils/commit/fc205832329d4f1060f7965e431811442d8bf5d0))
* add sd-wildcards-collection ([68b69fd](https://github.com/bluelovers/sd-wildcards-utils/commit/68b69fd8f3e0418b4ff52ca8c2fbf0bd23cb42a6))
* update snapshots ([530e312](https://github.com/bluelovers/sd-wildcards-utils/commit/530e312401b58820ce6b91ed5372a052c1a44856))
* update build ([07f3c21](https://github.com/bluelovers/sd-wildcards-utils/commit/07f3c21313b57fcd22b3ebc3d681f6c4c6c98b28))
* remove ([1e419a5](https://github.com/bluelovers/sd-wildcards-utils/commit/1e419a556a25fbd966086ec3a8fe9dbb48c0ec8f))
* update build ([20adbae](https://github.com/bluelovers/sd-wildcards-utils/commit/20adbae92b36417a0680eb7d5bf473a93f00b305))
* update build ([64cda4a](https://github.com/bluelovers/sd-wildcards-utils/commit/64cda4a97ee215f4a7f7c9c613b9978de8d31d5a))
* add README.md in zip ([48791dd](https://github.com/bluelovers/sd-wildcards-utils/commit/48791ddd41bd1615f6151044822f2eb0e2c924fe))
* update snapshots ([6d612cc](https://github.com/bluelovers/sd-wildcards-utils/commit/6d612cc648d44142a9c6f8e53f38b898f856d36b))
* update build ([841dc5f](https://github.com/bluelovers/sd-wildcards-utils/commit/841dc5f62bf744531e5e84a57d3837cc665667f0))
* remove ([9c4aea4](https://github.com/bluelovers/sd-wildcards-utils/commit/9c4aea491d2c006dee402e507de108eef3c1981e))
* update snapshots ([66e12e6](https://github.com/bluelovers/sd-wildcards-utils/commit/66e12e609460d681cf89bb801e1d7920681e87e5))
* update build ([ed39e91](https://github.com/bluelovers/sd-wildcards-utils/commit/ed39e917f306be0910573f5ae74bfa63b3b2a740))
* update snapshots ([cf4f2d8](https://github.com/bluelovers/sd-wildcards-utils/commit/cf4f2d8664c8cdbce7f692d50cdcd11d78d7c30e))
* update build ([a515d90](https://github.com/bluelovers/sd-wildcards-utils/commit/a515d907936bcaa3622042be392ff695edf6f3e2))
* remove ([deb13be](https://github.com/bluelovers/sd-wildcards-utils/commit/deb13be17fb0d732f7aa883b14e7f6fa9fedebe8))
* update snapshots ([e259c4d](https://github.com/bluelovers/sd-wildcards-utils/commit/e259c4d285e8cbdd552f999bb660be1f1902a572))
* update build ([4d60df6](https://github.com/bluelovers/sd-wildcards-utils/commit/4d60df670331e0502a3fa11b707317a1e8f030a0))
* update build ([82ee752](https://github.com/bluelovers/sd-wildcards-utils/commit/82ee752efd9a0dcfd91751d39592063ad6222df0))


### ⚙️　Continuous Integration

* update script ([63e12b7](https://github.com/bluelovers/sd-wildcards-utils/commit/63e12b795070fa239373b634f9eddffd4073b7b9))
* auto copy files ([678d9de](https://github.com/bluelovers/sd-wildcards-utils/commit/678d9de8cb1351be80132bf6867557d71e33c7c7))
* update script ([bf6f3b4](https://github.com/bluelovers/sd-wildcards-utils/commit/bf6f3b453cad7a16f9e3d3a24e59552067cc0de0))
* update script ([f284161](https://github.com/bluelovers/sd-wildcards-utils/commit/f284161b643d4224c7fc14160c23fa75877575fb))
* `__lazy-wildcards/**/fn/**__` ([65310b9](https://github.com/bluelovers/sd-wildcards-utils/commit/65310b9ee977662f6765799431dcc752d6bf9746))
* entryAll ([fd20252](https://github.com/bluelovers/sd-wildcards-utils/commit/fd2025281a3471562c89159acde58a4fe492c90e))
* update script ([641e54f](https://github.com/bluelovers/sd-wildcards-utils/commit/641e54f8b2829ffd27c2442fdbd31d12fd5f90e4))
* update script ([e43b9e3](https://github.com/bluelovers/sd-wildcards-utils/commit/e43b9e3de542d346e5e4894845882f278a3e3844))
* show old md5 ([c5b2121](https://github.com/bluelovers/sd-wildcards-utils/commit/c5b21219621dbe400d4af7461b9c71a34451cbda))
* update script ([759b24f](https://github.com/bluelovers/sd-wildcards-utils/commit/759b24f2e5498e46ccfd2b2e297b24b5d6014357))
* update script ([62e27d3](https://github.com/bluelovers/sd-wildcards-utils/commit/62e27d39e1e5e8abddade07f54947822c3fbe8a5))
* update script ([b607f0f](https://github.com/bluelovers/sd-wildcards-utils/commit/b607f0fd27bcadfc9d08990dfcd23c9edf50b0ad))
* update script ([76940b6](https://github.com/bluelovers/sd-wildcards-utils/commit/76940b6a444e1adbb7568424303dad3af6970436))
* update ([a74054b](https://github.com/bluelovers/sd-wildcards-utils/commit/a74054b78613b05fc375cc36d16166ccc5f3f54c))
* update scripts ([34b348c](https://github.com/bluelovers/sd-wildcards-utils/commit/34b348c3492b933bb4c97fdbc96e7d707b0e9faf))
* add `\[skip ci\]` ([2b165ef](https://github.com/bluelovers/sd-wildcards-utils/commit/2b165ef6b5d0017a7f2bb017495281c9ee52b01a))
* fix ([4abb2b0](https://github.com/bluelovers/sd-wildcards-utils/commit/4abb2b0a7f7e3d648b9ac58c45bc83b72978600e))
* merge script ([ff4cf69](https://github.com/bluelovers/sd-wildcards-utils/commit/ff4cf697b5168faad5468a43e53c3f25d2f1c9e1))
* fix script ([274f79b](https://github.com/bluelovers/sd-wildcards-utils/commit/274f79be60f92dc35dfbe9caedf1c830323f1835))
* fix script ([64f1120](https://github.com/bluelovers/sd-wildcards-utils/commit/64f112047d5b22d41ef3a142dc4aeac6311ec8b8))
* test ([feb5994](https://github.com/bluelovers/sd-wildcards-utils/commit/feb5994f6e20a335d5d2a3f45c6b4bf0b36d5038))
* test ([f7851b7](https://github.com/bluelovers/sd-wildcards-utils/commit/f7851b796f02864a64b83b84bade75154987786b))


### ♻️　Chores

* 端午 ([5af1404](https://github.com/bluelovers/sd-wildcards-utils/commit/5af14041f3e209b540faf4b8de94d0421dd5e6e9))
* a little better message ([bab7680](https://github.com/bluelovers/sd-wildcards-utils/commit/bab7680868c22d7e8e7fae5cc212676b4dfca563))
* . ([4cc08ff](https://github.com/bluelovers/sd-wildcards-utils/commit/4cc08ff91eac91cbbff7a211c5338fd67806eb56))
* delete others ([ac76ab3](https://github.com/bluelovers/sd-wildcards-utils/commit/ac76ab33e44c47323458fc4c9856b30a02b286bc))
* **release:** publish ([d957e58](https://github.com/bluelovers/sd-wildcards-utils/commit/d957e58612ceebe165fcc1ccb43d0684e946fad7))


### 🔖　Miscellaneous

* . ([ab65652](https://github.com/bluelovers/sd-wildcards-utils/commit/ab656525a9d3614623ced67add93178d88c72ff8))
* . ([f456be2](https://github.com/bluelovers/sd-wildcards-utils/commit/f456be225bd99f7298c907f2abae52c66590ace3))
* . ([be4c632](https://github.com/bluelovers/sd-wildcards-utils/commit/be4c632484e49249368e0cb7cd6247ac19162910))
* . ([e21dc94](https://github.com/bluelovers/sd-wildcards-utils/commit/e21dc94cdf7c132e5253ec2459cae8c5155d22ec))
* . ([4b595e3](https://github.com/bluelovers/sd-wildcards-utils/commit/4b595e30004639521b17dcedb4b1bbf087e30aec))
* . ([c8184ba](https://github.com/bluelovers/sd-wildcards-utils/commit/c8184ba9deb92ad2dc8b204793212eda985cb3fd))
* . ([bb4ef45](https://github.com/bluelovers/sd-wildcards-utils/commit/bb4ef45e7c957971ee06b2c822553c866dd4b1f8))
* . ([d8a80b2](https://github.com/bluelovers/sd-wildcards-utils/commit/d8a80b28a7c6cbc2d61f229ff3abc8379363eb87))
* . ([6cdcc37](https://github.com/bluelovers/sd-wildcards-utils/commit/6cdcc37cbeb66a10013ec281544755bf730f45fa))
* . ([8cc9333](https://github.com/bluelovers/sd-wildcards-utils/commit/8cc9333bed63e014cc0176589c9984f98e390c99))
* . ([cdb3090](https://github.com/bluelovers/sd-wildcards-utils/commit/cdb3090ffacb035ec57e30ea7a70b3d6d6ea33cb))
* . ([3a67c0f](https://github.com/bluelovers/sd-wildcards-utils/commit/3a67c0ffb37398aa485c28310764f970abab0165))
* . ([2da568f](https://github.com/bluelovers/sd-wildcards-utils/commit/2da568fc45ff41a9f10870ac1699ea095b049dc4))
* . ([bf29890](https://github.com/bluelovers/sd-wildcards-utils/commit/bf298908832813120fc1589e906c45a4bd795cd7))
* . ([95c7244](https://github.com/bluelovers/sd-wildcards-utils/commit/95c72443c1ab3e93df6b7bb70c1dce576c0917ac))
* . ([af1c88f](https://github.com/bluelovers/sd-wildcards-utils/commit/af1c88f79e828238fc543c019ddf70c3d016cfd1))
* . ([1aac6b0](https://github.com/bluelovers/sd-wildcards-utils/commit/1aac6b0a8721b7778a811a4889469a339d608a36))
* . ([a5aaefc](https://github.com/bluelovers/sd-wildcards-utils/commit/a5aaefcb121e69406cea9a8015022d075035eb8d))
* . ([c3ba6e6](https://github.com/bluelovers/sd-wildcards-utils/commit/c3ba6e6e9d335c4cae9e26ffb3df833bd6797aa9))
* . ([e2cc140](https://github.com/bluelovers/sd-wildcards-utils/commit/e2cc1407b83559e48863877248d47b1050419c19))
* . ([40cfc86](https://github.com/bluelovers/sd-wildcards-utils/commit/40cfc860454916144b700585d44790b047b700a0))
* . ([b31bb12](https://github.com/bluelovers/sd-wildcards-utils/commit/b31bb129bed55403fa6fd5543ceffa4b2d4db5fb))
* . ([eb0d045](https://github.com/bluelovers/sd-wildcards-utils/commit/eb0d04541736b48be78be2e3acd2bdefe093dd96))
* . ([f0984a6](https://github.com/bluelovers/sd-wildcards-utils/commit/f0984a6c8e18b4ad50a1f6ba00965c817aca7496))
* . ([9adf683](https://github.com/bluelovers/sd-wildcards-utils/commit/9adf683f29663094e7410f9bbbf17ab1a6d09c53))
* . ([715f0d5](https://github.com/bluelovers/sd-wildcards-utils/commit/715f0d5a436377b761320e932d8ac92bd140c5e0))
* . ([d7732e0](https://github.com/bluelovers/sd-wildcards-utils/commit/d7732e05893a88e73cae6ac60241e2297bc0c283))
* . ([cc4f7b2](https://github.com/bluelovers/sd-wildcards-utils/commit/cc4f7b202c92a713cdaf7c11b7570abd4c2b693c))
* . ([347ad85](https://github.com/bluelovers/sd-wildcards-utils/commit/347ad853b4723d9c0cfffe2d29bb29bea7ccbe7f))
* . ([3748d1d](https://github.com/bluelovers/sd-wildcards-utils/commit/3748d1df70dc09b49c43b8a652808ee9057fdd46))
* . ([d407408](https://github.com/bluelovers/sd-wildcards-utils/commit/d407408ed0ec0441d94fd6cb9ead7f25b57b4d3a))
* . ([54a67ff](https://github.com/bluelovers/sd-wildcards-utils/commit/54a67ffc1d66607cf8f39bc331664a389c413bbc))
* . ([ccbf007](https://github.com/bluelovers/sd-wildcards-utils/commit/ccbf0073d2718ffa0433068fac0a98851a793b67))
* . ([89374da](https://github.com/bluelovers/sd-wildcards-utils/commit/89374da5613e3c36d1360cf55a75ebbfd71ba3db))
* . ([85cca4f](https://github.com/bluelovers/sd-wildcards-utils/commit/85cca4f2482af7bb04f675669494bced3b2fa7e2))
* . ([0d086c9](https://github.com/bluelovers/sd-wildcards-utils/commit/0d086c94bbafa0bbcfa9fbc6d0a9a2a1ce1e980e))
* . ([cd414c9](https://github.com/bluelovers/sd-wildcards-utils/commit/cd414c96d7fa7e23b9e6d72802880476858656b5))
* . ([44d97dc](https://github.com/bluelovers/sd-wildcards-utils/commit/44d97dc94c515738617546e263bb9bb6e7d44500))
* . ([d209c85](https://github.com/bluelovers/sd-wildcards-utils/commit/d209c859c55b05e25923416fb9613393322ddad6))
* . ([d13e522](https://github.com/bluelovers/sd-wildcards-utils/commit/d13e522d641f23559ca7fda044a75065b50fc958))
* . ([79c8dde](https://github.com/bluelovers/sd-wildcards-utils/commit/79c8dde2da274fd40ef7790258e224cc5522094d))
* . ([03ca562](https://github.com/bluelovers/sd-wildcards-utils/commit/03ca5629ebef68bd8b4808f69be9470959d2e2d1))
* . ([00a1e21](https://github.com/bluelovers/sd-wildcards-utils/commit/00a1e21e4bfc7780b5b2a62e7509f20009b0ee7e))
* . ([cb5ec6a](https://github.com/bluelovers/sd-wildcards-utils/commit/cb5ec6a36a56db8e57197d6ed6a64ef18c4962df))
* . ([13e3a85](https://github.com/bluelovers/sd-wildcards-utils/commit/13e3a856752010c151f6aec135b7fe19480a7dbc))
* . ([591150e](https://github.com/bluelovers/sd-wildcards-utils/commit/591150e1352da516ef30ff548290001f3deb9449))
* . ([2f9341d](https://github.com/bluelovers/sd-wildcards-utils/commit/2f9341d9f084cced49856f95241a1f4f8ae8025e))
* . ([f13d0a3](https://github.com/bluelovers/sd-wildcards-utils/commit/f13d0a397252f42cbc7f8a8eefe70c1f93ef8a7a))
* . ([41b9dbd](https://github.com/bluelovers/sd-wildcards-utils/commit/41b9dbde898a4c92fdfbb0d401fb19bffed5cad3))
* . ([5c73ff0](https://github.com/bluelovers/sd-wildcards-utils/commit/5c73ff0ae824408ac24833b51b52bb6ac40a5671))
* . ([1ae7570](https://github.com/bluelovers/sd-wildcards-utils/commit/1ae75700fe7a87822b477f5045fc08f5e47fdf1f))
* . ([c8c8fc2](https://github.com/bluelovers/sd-wildcards-utils/commit/c8c8fc2f981cdcf2e9b9454a0748dd60a0b938b4))
* . ([21d9aa0](https://github.com/bluelovers/sd-wildcards-utils/commit/21d9aa015fc040cdb4d1aedcc903f93889db8552))
* . ([7b1e091](https://github.com/bluelovers/sd-wildcards-utils/commit/7b1e091c1caaefa17dbc5382146caa536c9d0a3c))
* . ([276154b](https://github.com/bluelovers/sd-wildcards-utils/commit/276154be253a335c3eeb1b3d8206907490a5631d))
* . ([d25f4cc](https://github.com/bluelovers/sd-wildcards-utils/commit/d25f4cc163de1b22359e1ecc35c01f9af5d21cfa))
* . ([a18a9e5](https://github.com/bluelovers/sd-wildcards-utils/commit/a18a9e595a5974143a9d81acd3157da593091e0f))
* . ([d70a0c1](https://github.com/bluelovers/sd-wildcards-utils/commit/d70a0c13ec416fb1296bc2b7290865e0ac0fb116))
* . ([4f978e7](https://github.com/bluelovers/sd-wildcards-utils/commit/4f978e7a1f13e397d75a384b4dad6e81277dd563))
* . ([b2f1613](https://github.com/bluelovers/sd-wildcards-utils/commit/b2f1613a318dd3ac053741b5d28fdd43f0a0892e))
* . ([efdf183](https://github.com/bluelovers/sd-wildcards-utils/commit/efdf18392881958bc9fc10c4b87be8d067d29552))
* . ([c7a1c0a](https://github.com/bluelovers/sd-wildcards-utils/commit/c7a1c0a003582b7995a8b003fb90137cae8fe9b9))
* . ([13c6ee4](https://github.com/bluelovers/sd-wildcards-utils/commit/13c6ee4d5e2cb1e18981f01ffc72b868db0f1297))
* . ([f6e90ca](https://github.com/bluelovers/sd-wildcards-utils/commit/f6e90ca4301d6dca5f9fe47b5aa4e5a57b8a5279))
* . ([409549b](https://github.com/bluelovers/sd-wildcards-utils/commit/409549b4d9b4e91658d587cd57c26d9676ae7a38))
* . ([06de84c](https://github.com/bluelovers/sd-wildcards-utils/commit/06de84c2dc2b7d94b09ad0c182cfef71da2b6a77))
* . ([95745fa](https://github.com/bluelovers/sd-wildcards-utils/commit/95745faa292f678cf71955e30d71c2452715ef80))
* . ([163c4ff](https://github.com/bluelovers/sd-wildcards-utils/commit/163c4ff01d1fd2a126ace01a12d723ced0ca4fad))
* . ([05da692](https://github.com/bluelovers/sd-wildcards-utils/commit/05da6923ef8a9990788724c4c3179777ca5e2c1f))
* . ([aaf01cf](https://github.com/bluelovers/sd-wildcards-utils/commit/aaf01cfd64753f79b9ca36374dbe2d122fe25c10))
* . ([75dd884](https://github.com/bluelovers/sd-wildcards-utils/commit/75dd8841e056e213a7e897162da095db0d4d2187))
* . ([f020798](https://github.com/bluelovers/sd-wildcards-utils/commit/f020798e626f0f86a9d9baa0a9a90796511bd530))
* . ([0d78b43](https://github.com/bluelovers/sd-wildcards-utils/commit/0d78b43041a9e042005531c4430dd93bcf843186))
* . ([6b2657f](https://github.com/bluelovers/sd-wildcards-utils/commit/6b2657ff68c2ff6e41389a9d8cc4d44216aa9326))
* . ([a748ef8](https://github.com/bluelovers/sd-wildcards-utils/commit/a748ef833be8068956a02f9c048a7675845dcb50))
* . ([ddb5eb5](https://github.com/bluelovers/sd-wildcards-utils/commit/ddb5eb5f6896ef4af498a82cdefa1e0980c3237e))
* . ([2e8ed54](https://github.com/bluelovers/sd-wildcards-utils/commit/2e8ed541883249d6ad42771219b6ecef160a1a3e))
* . ([3d6c602](https://github.com/bluelovers/sd-wildcards-utils/commit/3d6c60207bebbb1192bceedd2813a312fec4b966))



## [1.3.12](https://github.com/bluelovers/sd-wildcards-utils/compare/sd-wildcards-utils@1.3.10...sd-wildcards-utils@1.3.12) (2024-11-19)


### BREAKING CHANGES

* Vision/fake-dummy-wildcards.yaml
* Vision/fake-dummy-wildcards.yaml
* subject/style-book
* refactor and delete lazy-wildcards/costume
* refactor and delete lazy-wildcards/costume
* refactor { background/anything => subject/env-bg*/*/prompts }



### 📦　Code Refactoring

* dataset/style ([5d10343](https://github.com/bluelovers/sd-wildcards-utils/commit/5d103439117c0b22f9a5de4b25d3b29512abb691))
* dataset/style ([26b3f7f](https://github.com/bluelovers/sd-wildcards-utils/commit/26b3f7f41b76e1f6acab302e5b94a79a46088128))
* subject/style-book ([07dc479](https://github.com/bluelovers/sd-wildcards-utils/commit/07dc47945a61bda6a711a8b096902d43fa7fd09c))
* update cache ([3c340cc](https://github.com/bluelovers/sd-wildcards-utils/commit/3c340ccf69e95df51b7f6a93a9cfc3e693882c79))
* refactor and delete lazy-wildcards/costume ([7eb4c39](https://github.com/bluelovers/sd-wildcards-utils/commit/7eb4c399d543c11a3bb79ef5c84399b8d72fb12a))
* refactor and delete lazy-wildcards/costume ([c6320d8](https://github.com/bluelovers/sd-wildcards-utils/commit/c6320d8d9261b08e2a52de021287abf1c62ca95d))
* refactor { background/anything => subject/env-bg*/*/prompts } ([ede2cd4](https://github.com/bluelovers/sd-wildcards-utils/commit/ede2cd4049fff929a81dd41ecef4b0cf210ccd09))


### 📚　Documentation

* update readme ([162980f](https://github.com/bluelovers/sd-wildcards-utils/commit/162980f6811c0e1a9e79363cf145c6dcca04d10e))
* update readme ([8a1084b](https://github.com/bluelovers/sd-wildcards-utils/commit/8a1084b75fc40a8f5fbd735dbe62019255d7a6eb))


### 🛠　Build System

* update build ([592e194](https://github.com/bluelovers/sd-wildcards-utils/commit/592e194b7d9ac6a2a65d830abe058f8bca91d7e0))
* update snapshots ([a629cca](https://github.com/bluelovers/sd-wildcards-utils/commit/a629ccacc308b236bd9417054078d24ea5b0d72d))
* update build ([52fcfcd](https://github.com/bluelovers/sd-wildcards-utils/commit/52fcfcd8d8427604f7f9e3fb14acc30f511612df))
* Vision/fake-dummy-wildcards.yaml ([6886a72](https://github.com/bluelovers/sd-wildcards-utils/commit/6886a727a59935ee384d7466d31640a8f69bd51c))
* Vision/fake-dummy-wildcards.yaml ([bf9f6bc](https://github.com/bluelovers/sd-wildcards-utils/commit/bf9f6bc5faf8bb5966ca58931cc08fb0424b5012))
* update snapshots ([7311a82](https://github.com/bluelovers/sd-wildcards-utils/commit/7311a82c8702d334166bd1191d5fb4d9aacb9acb))
* update build ([a396d3d](https://github.com/bluelovers/sd-wildcards-utils/commit/a396d3d3c3f06b44923dc108a359327177ca41b9))
* update snapshots ([f266a77](https://github.com/bluelovers/sd-wildcards-utils/commit/f266a77545e706357834c8ebe0ccdb00f5c8dedb))
* update build ([dc458c6](https://github.com/bluelovers/sd-wildcards-utils/commit/dc458c63f0ac7d29533128a38b31436a69cd4258))
* update snapshots ([9662bab](https://github.com/bluelovers/sd-wildcards-utils/commit/9662babde3e866e1c553f4d83c102d1168d1484d))
* update build ([9b07359](https://github.com/bluelovers/sd-wildcards-utils/commit/9b07359f3cea88830d04f803733f035bf9540277))
* update snapshots ([cf5bbe4](https://github.com/bluelovers/sd-wildcards-utils/commit/cf5bbe4b79df81f111e4ef43c90b7216280838d6))
* update build ([5928612](https://github.com/bluelovers/sd-wildcards-utils/commit/5928612349a657f8f1a84f81039dd74fd16fa42a))


### ⚙️　Continuous Integration

* update script ([ad47776](https://github.com/bluelovers/sd-wildcards-utils/commit/ad477763e54068f8c9cfdc3de63de595248140b9))
* update script ([e6222f5](https://github.com/bluelovers/sd-wildcards-utils/commit/e6222f56c4d44fa2a916eae77b423726982fc630))


### 📌　Dependencies

* update deps ([0366db8](https://github.com/bluelovers/sd-wildcards-utils/commit/0366db8401049e1f4369fb07dd7354d5a26c1e90))


### 🔖　Miscellaneous

* . ([8d3a874](https://github.com/bluelovers/sd-wildcards-utils/commit/8d3a874a43de3652345124da0a3a5e140e294186))
* . ([3267897](https://github.com/bluelovers/sd-wildcards-utils/commit/326789738d72e3e971edc81cdd53e5c73eec4891))
* . ([059c55b](https://github.com/bluelovers/sd-wildcards-utils/commit/059c55b17d09a6562afa75908c6be46da481ecea))
* . ([b8d4b14](https://github.com/bluelovers/sd-wildcards-utils/commit/b8d4b148e8e9e5e522913678e0cf5acaef2934fe))
* . ([5a4644d](https://github.com/bluelovers/sd-wildcards-utils/commit/5a4644de62d2dcd57d1174cd866687c1ea91e071))
* . ([6f6fef6](https://github.com/bluelovers/sd-wildcards-utils/commit/6f6fef680d288da5dce82245404179784caf02a8))
* . ([ee232c2](https://github.com/bluelovers/sd-wildcards-utils/commit/ee232c26e72a78db64578a90de2861e1ba55e988))



## [1.3.10](https://github.com/bluelovers/sd-wildcards-utils/compare/sd-wildcards-utils@1.3.7...sd-wildcards-utils@1.3.10) (2024-11-12)


### BREAKING CHANGES

* add allowWildcardsAtEndMatchRecord
* update format handler



### 🐛　Bug Fixes

* wrong filename ([fbe16a4](https://github.com/bluelovers/sd-wildcards-utils/commit/fbe16a4cc4ed163928c53183c9d6d709e926f131))


### ✨　Features

* add allowWildcardsAtEndMatchRecord ([e839836](https://github.com/bluelovers/sd-wildcards-utils/commit/e83983638427185fce12ce13657e167ece6def4e))


### 📦　Code Refactoring

* update format handler ([c683be5](https://github.com/bluelovers/sd-wildcards-utils/commit/c683be598a9c1232e1750e580c019e0ce12b0122))
* update and refactor some wildcards ([ff5a927](https://github.com/bluelovers/sd-wildcards-utils/commit/ff5a927ee29a6e0ca01bb6081f66daf60e1542c6))


### 🚨　Tests

* snap all useable entry ([b1a2307](https://github.com/bluelovers/sd-wildcards-utils/commit/b1a23078d66be0c97fa4e6403ba6fc5788b6d13a))
* fix wrong snap path ([5f68685](https://github.com/bluelovers/sd-wildcards-utils/commit/5f68685699405ce65a8d6de02d1933ea8c7bda57))


### 🛠　Build System

* update snapshots ([219adaa](https://github.com/bluelovers/sd-wildcards-utils/commit/219adaa2f1198afd37076603775b887002076cb0))
* update build ([16ddbb7](https://github.com/bluelovers/sd-wildcards-utils/commit/16ddbb7e63deb21acb72cf5ba0ecd10c2f3be14c))
* update snapshots ([e52dcc6](https://github.com/bluelovers/sd-wildcards-utils/commit/e52dcc63722a945bc85a5445ab36398b92bd5c9f))
* update build ([53e9b5b](https://github.com/bluelovers/sd-wildcards-utils/commit/53e9b5b4fc4e74383b912120d38d9f9859a071c8))
* update snapshots ([c00f47f](https://github.com/bluelovers/sd-wildcards-utils/commit/c00f47f56077eb730d3425d1f58669eeec5b4ae4))
* update build ([15e75c6](https://github.com/bluelovers/sd-wildcards-utils/commit/15e75c677c304900dc8bcbb31495f939bbc86619))
* update snapshots ([50d4f40](https://github.com/bluelovers/sd-wildcards-utils/commit/50d4f403d208e9f960723e86d438839fb77e2220))
* update build ([26d8e87](https://github.com/bluelovers/sd-wildcards-utils/commit/26d8e87e3492038918773cbe2fd18cf7fdc5d8a6))
* update snapshots ([bd68993](https://github.com/bluelovers/sd-wildcards-utils/commit/bd689939e2450691887d98085245969fac2639e5))
* update build ([333a647](https://github.com/bluelovers/sd-wildcards-utils/commit/333a64723eb877c03ca32b6235be855fd32fa005))
* update snapshots ([930e4ac](https://github.com/bluelovers/sd-wildcards-utils/commit/930e4ac0c1d18cfbc605cf6bc48d0ce55930dce5))
* update build ([8e367e6](https://github.com/bluelovers/sd-wildcards-utils/commit/8e367e69cff812462bf063123e9f07a9f7c0ecda))
* update build ([60a398b](https://github.com/bluelovers/sd-wildcards-utils/commit/60a398b15c6390f860cc8dc26842de37c680e63f))
* update build ([265f0aa](https://github.com/bluelovers/sd-wildcards-utils/commit/265f0aacd33a2fab891292725aa26a921a1f7866))
* update snapshots ([43acd16](https://github.com/bluelovers/sd-wildcards-utils/commit/43acd163d514e8969f6b92fca6e8e57588788414))
* update build ([fb2a9c3](https://github.com/bluelovers/sd-wildcards-utils/commit/fb2a9c3d0edb64231195084adf3cb025b67778d6))
* update snapshots ([7519605](https://github.com/bluelovers/sd-wildcards-utils/commit/75196057667510fcc52be1fb85097f5cb039a79f))
* update snapshots ([0b7d35d](https://github.com/bluelovers/sd-wildcards-utils/commit/0b7d35d418305e360008b9d0787f4301b11f4b75))
* update build ([b103f83](https://github.com/bluelovers/sd-wildcards-utils/commit/b103f83c90a2d9069da957447e973aadbae333fa))
* update snapshots ([674a83d](https://github.com/bluelovers/sd-wildcards-utils/commit/674a83d7713d33849574106eaf7da223deff9929))
* update build ([f46a06b](https://github.com/bluelovers/sd-wildcards-utils/commit/f46a06b0ef681535135c6224f7959f481aa2e672))


### ⚙️　Continuous Integration

* update log ([918894e](https://github.com/bluelovers/sd-wildcards-utils/commit/918894e16e0169ff18b945f9af3c34f634f69526))
* . ([4593260](https://github.com/bluelovers/sd-wildcards-utils/commit/45932603baad883f7ab48255f2daacc1b09765cb))


### ♻️　Chores

* 清除列表結尾 , 號 ([9b93760](https://github.com/bluelovers/sd-wildcards-utils/commit/9b9376029ad5f6085da3350a2a7f46a15b35bb36))


### 🔖　Miscellaneous

* . ([eddeb50](https://github.com/bluelovers/sd-wildcards-utils/commit/eddeb50df69b0ffc0318110d855d6b4f25b997c6))
* . ([ae1ea76](https://github.com/bluelovers/sd-wildcards-utils/commit/ae1ea76b6095084f5fb6a35876e726308531e969))
* . ([6b6182c](https://github.com/bluelovers/sd-wildcards-utils/commit/6b6182cfe5db15b4d565685abab6831612cb7216))
* . ([46268b1](https://github.com/bluelovers/sd-wildcards-utils/commit/46268b18e6af6b1fb0fcbadac446e529cdabf4cf))
* . ([f8ac629](https://github.com/bluelovers/sd-wildcards-utils/commit/f8ac62931571b8b134f5731abf1c78e003dae40e))
* . ([8de7e08](https://github.com/bluelovers/sd-wildcards-utils/commit/8de7e08d83dccc3896857907bf36ae85208f1cab))
* . ([d7d582a](https://github.com/bluelovers/sd-wildcards-utils/commit/d7d582ae3ee985d2c805c1a681efbf0543a087a6))
* . ([a833905](https://github.com/bluelovers/sd-wildcards-utils/commit/a833905b3377ab12d753a54b2cc4a6e398cea5ed))
* . ([a310f58](https://github.com/bluelovers/sd-wildcards-utils/commit/a310f58bc80ecc5e123839620b22f35dc48bb531))
* . ([40ba0f4](https://github.com/bluelovers/sd-wildcards-utils/commit/40ba0f47975dd17fd2013b76916f3e9c505506aa))
* . ([56efd93](https://github.com/bluelovers/sd-wildcards-utils/commit/56efd93bc9988321af16835f282596e22136337a))
* . ([3e55cd7](https://github.com/bluelovers/sd-wildcards-utils/commit/3e55cd776494fe1f474e3eb6c581c12494760e68))
* . ([525aad9](https://github.com/bluelovers/sd-wildcards-utils/commit/525aad9005e205ad8fc3623af9b7758a9619124a))
* . ([52cc7be](https://github.com/bluelovers/sd-wildcards-utils/commit/52cc7be2728059028285deaf9de61b8145d42b56))
* . ([3ed753a](https://github.com/bluelovers/sd-wildcards-utils/commit/3ed753ae0ddf20f7ba3b27342c18250fdc51370c))
* . ([3d6bda5](https://github.com/bluelovers/sd-wildcards-utils/commit/3d6bda59eb3098dcf99e61d75eebffc2ce328613))
* . ([8956b77](https://github.com/bluelovers/sd-wildcards-utils/commit/8956b773543f240acdf06964e55868466ed24519))



## [1.3.7](https://github.com/bluelovers/sd-wildcards-utils/compare/sd-wildcards-utils@1.3.6...sd-wildcards-utils@1.3.7) (2024-10-08)


### BREAKING CHANGES

* upload wildcards
* rename and add script



### 🐛　Bug Fixes

* support check a little more syntax error ([24774d2](https://github.com/bluelovers/sd-wildcards-utils/commit/24774d2e245b3db9cdb6fd6ef081129506a05073))


### ✨　Features

* trim line ([9861543](https://github.com/bluelovers/sd-wildcards-utils/commit/9861543f24fd87179eb807089fbd2755fe4ac505))


### 📦　Code Refactoring

* upload wildcards ([daad113](https://github.com/bluelovers/sd-wildcards-utils/commit/daad1136a9e6086c5a73d4a7b55a33822c25a9a9))
* rename and add script ([af0ae91](https://github.com/bluelovers/sd-wildcards-utils/commit/af0ae919afad2460dc246d2f2251a3c7cd403f9c))


### 🛠　Build System

* update snapshots ([3a628ea](https://github.com/bluelovers/sd-wildcards-utils/commit/3a628ea14f28a0e21c49895ed7ed183d5a3d7f56))
* update build ([d7b86da](https://github.com/bluelovers/sd-wildcards-utils/commit/d7b86dac4c2d6165b725056ef0c6a0ee9674387b))
* update snapshots ([ddd779f](https://github.com/bluelovers/sd-wildcards-utils/commit/ddd779f308bed8d362c5c254a9db477442dab06b))
* update build ([30500f4](https://github.com/bluelovers/sd-wildcards-utils/commit/30500f47c535f05334a32e2fdfd45f7af8844c42))
* update wildcards ([7d60552](https://github.com/bluelovers/sd-wildcards-utils/commit/7d60552085698cad71a497aa7ddda4a56f1266fa))
* update snapshots ([9ff9355](https://github.com/bluelovers/sd-wildcards-utils/commit/9ff93554c363993c4c3d0e88c2cf3fecef9ac9af))
* update build ([bebbc65](https://github.com/bluelovers/sd-wildcards-utils/commit/bebbc6593f9f7ee9bca5f46b3d2fd78ed8250423))
* push to git ([2459dd3](https://github.com/bluelovers/sd-wildcards-utils/commit/2459dd3e17f6372c2dc378da6144f45d9d759061))
* update build ([cc3614b](https://github.com/bluelovers/sd-wildcards-utils/commit/cc3614be6b2260be766ba051b1ba978c3c4f36e1))
* update build ([c0cdf97](https://github.com/bluelovers/sd-wildcards-utils/commit/c0cdf97aa51d183a419ce94c9e46323138f3637e))


### ⚙️　Continuous Integration

* update script ([4235cdf](https://github.com/bluelovers/sd-wildcards-utils/commit/4235cdfaab78ddbc531ff486a5abc982ef654fc3))


### ♻️　Chores

* update wildcards ([a11d7ac](https://github.com/bluelovers/sd-wildcards-utils/commit/a11d7ac9b66daaea140fa87981310057a35bdc95))


### 📌　Dependencies

* update deps ([460b4d1](https://github.com/bluelovers/sd-wildcards-utils/commit/460b4d16596b74e69399635a2aa1cadb9fb0b54c))
* **wildcards:** update billionsOfWildcardsCharacterVehicle_v245 ([8e7d39c](https://github.com/bluelovers/sd-wildcards-utils/commit/8e7d39cd7bceaf679e019c6e8c203e2717f33193))


### 🔖　Miscellaneous

* . ([f5be5e9](https://github.com/bluelovers/sd-wildcards-utils/commit/f5be5e9b1314bc5475f6beed4d93f74ca0397815))
* . ([6160b14](https://github.com/bluelovers/sd-wildcards-utils/commit/6160b147949fe44c9f9dc106110f3ae03b176479))
* . ([833a9a5](https://github.com/bluelovers/sd-wildcards-utils/commit/833a9a5a6fac1792028703274b2f3f7a70ae0301))
* update build ([fed281b](https://github.com/bluelovers/sd-wildcards-utils/commit/fed281be64205466731580f88c0f5fa2eadead2e))
* . ([cd2f86b](https://github.com/bluelovers/sd-wildcards-utils/commit/cd2f86bf00992d031ce652c7a925e4aeb478643d))



## [1.3.6](https://github.com/bluelovers/sd-wildcards-utils/compare/sd-wildcards-utils@1.3.5...sd-wildcards-utils@1.3.6) (2024-08-10)



### 🛠　Build System

* update build ([9adff69](https://github.com/bluelovers/sd-wildcards-utils/commit/9adff6956c6b55a4cbcf1e768628ff179c347368))



## [1.3.5](https://github.com/bluelovers/sd-wildcards-utils/compare/sd-wildcards-utils@1.3.4...sd-wildcards-utils@1.3.5) (2024-08-10)

**Note:** Version bump only for package sd-wildcards-utils





## [1.3.4](https://github.com/bluelovers/sd-wildcards-utils/compare/sd-wildcards-utils@1.3.2...sd-wildcards-utils@1.3.4) (2024-08-10)



### 🐛　Bug Fixes

* check scalar value length ([d864874](https://github.com/bluelovers/sd-wildcards-utils/commit/d864874183f9f1e7562ab51a462fbf0a4a2c871b))
* weapen => weapon ([cc60099](https://github.com/bluelovers/sd-wildcards-utils/commit/cc600998b580579a6978d3f22adc52b6a276a1da))


### ✨　Features

* mecha-musume ([4e25dbf](https://github.com/bluelovers/sd-wildcards-utils/commit/4e25dbfbf0b49c90c11b13887885a29da88e6cff))
* Shroom-Knight ([bddba13](https://github.com/bluelovers/sd-wildcards-utils/commit/bddba1355b7b1505b251dee5e8cfeb292339e27a))
* stripBlankLines ([292a32a](https://github.com/bluelovers/sd-wildcards-utils/commit/292a32a2bc83b52bd8ec5c25a566afbde6559c39))


### 📦　Code Refactoring

* costume-ethnicity ([e0ce71b](https://github.com/bluelovers/sd-wildcards-utils/commit/e0ce71bbc6714a50bee45e051190acacc131052e))
* scenes ([8d4b269](https://github.com/bluelovers/sd-wildcards-utils/commit/8d4b26978a55c5243d80a54ce4e57541deb33054))
* . ([9e3845d](https://github.com/bluelovers/sd-wildcards-utils/commit/9e3845d97520684dd3634e3ca1a78983b15fc044))
* style-art-type ([10a1998](https://github.com/bluelovers/sd-wildcards-utils/commit/10a19984cb72b263fb7ec9b8653a966860ab0ec7))
* biomachine_body_horror ([a8d5d39](https://github.com/bluelovers/sd-wildcards-utils/commit/a8d5d39f6e8649b095b7a4b70c0a66c36d20cc33))
* subject/style-book/shared/style-adj ([bac1fd1](https://github.com/bluelovers/sd-wildcards-utils/commit/bac1fd17cb2a9882514511cd1ef5c8932c0f9587))
* rename style- ([895da7e](https://github.com/bluelovers/sd-wildcards-utils/commit/895da7e6fb5a791f192fad06cefd575a0d0ebe4a))
* rename style- ([8c4841f](https://github.com/bluelovers/sd-wildcards-utils/commit/8c4841f46d9a84179acf808c01c4a47e787cd642))


### 🛠　Build System

* update build ([0fcfa45](https://github.com/bluelovers/sd-wildcards-utils/commit/0fcfa45f4c30938051ca4ef534f19bf4712d866b))
* update build ([968c4ea](https://github.com/bluelovers/sd-wildcards-utils/commit/968c4ea7cd48b0904a64bfb84057cb2d7a5be27b))
* update build ([73ef0dc](https://github.com/bluelovers/sd-wildcards-utils/commit/73ef0dc2305967f7ad5f3b5e3e4ad2369a53ab71))


### ⚙️　Continuous Integration

* update script ([fc1e83f](https://github.com/bluelovers/sd-wildcards-utils/commit/fc1e83f1b27532e6a8ab2223d42ddef0aeaa17f9))


### ♻️　Chores

* idea ([58066c9](https://github.com/bluelovers/sd-wildcards-utils/commit/58066c9238e0095a21f849e897ac07c1ef368591))


### 🔖　Miscellaneous

* . ([1e9ef13](https://github.com/bluelovers/sd-wildcards-utils/commit/1e9ef13bfbadf743b20109e1974f13115ad60dcd))
* . ([d103e48](https://github.com/bluelovers/sd-wildcards-utils/commit/d103e483808f5699adecead8be187e5fda16da1f))
* . ([fdb14fb](https://github.com/bluelovers/sd-wildcards-utils/commit/fdb14fbcc30194e5c3e37161d3adaf87d472dc4b))
* . ([d2236df](https://github.com/bluelovers/sd-wildcards-utils/commit/d2236df6c0a1b2ad86a2da45ced876cc54b50323))
* . ([cf24f58](https://github.com/bluelovers/sd-wildcards-utils/commit/cf24f58c540f9f9601fb1a2595eb172111fecfc4))
* . ([72c808a](https://github.com/bluelovers/sd-wildcards-utils/commit/72c808ad0f4129df548bddc55427a26c8dc48e91))



## [1.3.2](https://github.com/bluelovers/sd-wildcards-utils/compare/sd-wildcards-utils@1.3.1...sd-wildcards-utils@1.3.2) (2024-08-02)



### 🛠　Build System

* update build ([4ee63a8](https://github.com/bluelovers/sd-wildcards-utils/commit/4ee63a897cd2207447538f26668bace3da298cb1))


### ♻️　Chores

* `costume-weapen` ([cbf7ed1](https://github.com/bluelovers/sd-wildcards-utils/commit/cbf7ed1bd59c4a0427cc2774fd8c2cf5ec6919e9))


### 🔖　Miscellaneous

* . ([73ac1b4](https://github.com/bluelovers/sd-wildcards-utils/commit/73ac1b40c784da4e8bcf18af4904c85d189b15c1))
* . ([388916f](https://github.com/bluelovers/sd-wildcards-utils/commit/388916fb3ceeb869bdf6a13146f76bcecb938017))



## [1.3.1](https://github.com/bluelovers/sd-wildcards-utils/compare/sd-wildcards-utils@1.2.1...sd-wildcards-utils@1.3.1) (2024-07-28)


### BREAKING CHANGES

* ignore some error
* .
* **dict:** { utils/season => subject/moment/season/main }
* update for DynamicWildcards unleashed v2



### 🐛　Bug Fixes

* strip space ([5b2156b](https://github.com/bluelovers/sd-wildcards-utils/commit/5b2156b3868d0703bbf3738558f05a8855ed7005))
* update for DynamicWildcards unleashed v2 ([19fc5d7](https://github.com/bluelovers/sd-wildcards-utils/commit/19fc5d7ff0ba65aace716763041ba3993fedc6b7))


### ✨　Features

* add 2b (nier:automata) ([17802fa](https://github.com/bluelovers/sd-wildcards-utils/commit/17802fa7a19754ea4d90dc35213f9faaa0047d37))


### 📦　Code Refactoring

* ignore some error ([ae3e696](https://github.com/bluelovers/sd-wildcards-utils/commit/ae3e696cdfdd749787b0c94cda0fa1faced04c55))
* . ([c2a23b3](https://github.com/bluelovers/sd-wildcards-utils/commit/c2a23b33e2c0e4a9bef9ab076f29d563a290c6e6))
* **dict:** { utils/season => subject/moment/season/main } ([c94889a](https://github.com/bluelovers/sd-wildcards-utils/commit/c94889a6452f4615aa09713b379a51663d848ae3))


### 🛠　Build System

* update build ([2f2ec2d](https://github.com/bluelovers/sd-wildcards-utils/commit/2f2ec2de08d4840595da289e664227bd31f15caa))
* update build ([3ba003a](https://github.com/bluelovers/sd-wildcards-utils/commit/3ba003ae9181bcf51becde7655b651907a670277))


### ♻️　Chores

* update wildcards ([2337d7f](https://github.com/bluelovers/sd-wildcards-utils/commit/2337d7f1e0fc5b78d9d2574dfde384a7005955c3))
* add queens_blade ([8d798d3](https://github.com/bluelovers/sd-wildcards-utils/commit/8d798d34516622b4b92cddfcd138dbdd342581bf))
* add hotel-business-bedroom ([613fe86](https://github.com/bluelovers/sd-wildcards-utils/commit/613fe861d5591b524051c69a8da4707669d41138))
* add `getTopRootContents` ([2108304](https://github.com/bluelovers/sd-wildcards-utils/commit/21083047cd36818018a4f0eff7548d040ea37115))


### 🔖　Miscellaneous

* . ([ccc7f04](https://github.com/bluelovers/sd-wildcards-utils/commit/ccc7f043b6ee8ec5dffbfa6333278bd4a8e06299))
* . ([585bb33](https://github.com/bluelovers/sd-wildcards-utils/commit/585bb336ea9f4529a99b8b3625744932f2f9bf1e))
* . ([e2c5e8d](https://github.com/bluelovers/sd-wildcards-utils/commit/e2c5e8d40f0354d7dd87363556c89aad19892824))
* . ([14f9be8](https://github.com/bluelovers/sd-wildcards-utils/commit/14f9be8ac34f65ff5c82fae9a35f674a4bd310fa))
* . ([8c15246](https://github.com/bluelovers/sd-wildcards-utils/commit/8c15246b8565793cbb90f06a2516fee480ac9dbf))
* . ([18b2a76](https://github.com/bluelovers/sd-wildcards-utils/commit/18b2a76b9ec9c6d541768ce30758f374836e1743))
* . ([382a7dc](https://github.com/bluelovers/sd-wildcards-utils/commit/382a7dcb775082d396b86e9a1304b0d3b57e3c7c))



## [1.2.1](https://github.com/bluelovers/sd-wildcards-utils/compare/sd-wildcards-utils@1.1.1...sd-wildcards-utils@1.2.1) (2024-06-25)


### BREAKING CHANGES

* support glob ignore



### ✨　Features

* interior-style-anything ([fa12cc3](https://github.com/bluelovers/sd-wildcards-utils/commit/fa12cc364c0aac061171c32c598e81034652c095))
* support glob ignore ([e29fa61](https://github.com/bluelovers/sd-wildcards-utils/commit/e29fa61e098616cef5de3999feb9c2e3ddb2b168))
* add Ayanami_Rei ([8dd2972](https://github.com/bluelovers/sd-wildcards-utils/commit/8dd297267aa2d85b23ca82a294d93c819f986df6))


### ⚙️　Continuous Integration

* update scripts ([bb351ca](https://github.com/bluelovers/sd-wildcards-utils/commit/bb351caa7ddef334740e52931741ff30761b598e))



## [1.1.1](https://github.com/bluelovers/sd-wildcards-utils/compare/sd-wildcards-utils@1.0.29...sd-wildcards-utils@1.1.1) (2024-06-22)


### BREAKING CHANGES

* maxErrors



### 🐛　Bug Fixes

* RE_DYNAMIC_PROMPTS_WILDCARDS ([22ac0b1](https://github.com/bluelovers/sd-wildcards-utils/commit/22ac0b132675977278387b3c5e70d142275088e9))
* avoid comment ([f821025](https://github.com/bluelovers/sd-wildcards-utils/commit/f821025af3d3c5a3524e0ef5c655a0f92bd38ede))


### ✨　Features

* maxErrors ([3205704](https://github.com/bluelovers/sd-wildcards-utils/commit/3205704c3ce0f2026e46ea4aa9a3b862f800aa4d))


### 🚨　Tests

* cf/creatures/*.yaml ([8e65080](https://github.com/bluelovers/sd-wildcards-utils/commit/8e6508076c61418f19676f12700fa6c31b9ae087))


### ♻️　Chores

* update wildcards ([a5599e9](https://github.com/bluelovers/sd-wildcards-utils/commit/a5599e91b6d5b97c038fc2d3d97dd1b54fe96761))


### 🔖　Miscellaneous

* . ([c024348](https://github.com/bluelovers/sd-wildcards-utils/commit/c024348d3a7e4acf03f2b5102dce7755cbc19847))
* . ([2591173](https://github.com/bluelovers/sd-wildcards-utils/commit/25911738d950430b13dba9e931ca2879c35a59b8))
* . ([a095eef](https://github.com/bluelovers/sd-wildcards-utils/commit/a095eef467b296feb486f34e3473047cfd78c4dd))



## [1.0.29](https://github.com/bluelovers/sd-wildcards-utils/compare/sd-wildcards-utils@1.0.28...sd-wildcards-utils@1.0.29) (2024-06-10)


### BREAKING CHANGES

* **wildcards:** rename and fix missing nodes
* add `checkAllSelfLinkWildcardsExists`



### 🐛　Bug Fixes

* **wildcards:** rename and fix missing nodes ([f935212](https://github.com/bluelovers/sd-wildcards-utils/commit/f935212f1e60aa20bea04f727cb11e414e2f0954))


### 📦　Code Refactoring

* add `checkAllSelfLinkWildcardsExists` ([283f607](https://github.com/bluelovers/sd-wildcards-utils/commit/283f60718502740d5066ca60f4306f4532a0fa92))


### ♻️　Chores

* **wildcards:** add cosplay-char ([b4aeea8](https://github.com/bluelovers/sd-wildcards-utils/commit/b4aeea8d363da3593d55ed1f78a31aa4b4ee07d8))



## [1.0.28](https://github.com/bluelovers/sd-wildcards-utils/compare/sd-wildcards-utils@1.0.27...sd-wildcards-utils@1.0.28) (2024-06-09)



### 🐛　Bug Fixes

* _validPair ([f56e5ee](https://github.com/bluelovers/sd-wildcards-utils/commit/f56e5ee5affe0333f271d7d399c9330d2716a763))


### ✨　Features

* enable `prettyErrors`, disable `keepSourceTokens` ([c4af7fa](https://github.com/bluelovers/sd-wildcards-utils/commit/c4af7fac400cc71eee9b26df3bb4c6b256d9355d))
* support merge map ([244e277](https://github.com/bluelovers/sd-wildcards-utils/commit/244e27793bccd64044f12f3a435c6c7f61a8a41b))
* update pathsToWildcardsPath ([b86f35a](https://github.com/bluelovers/sd-wildcards-utils/commit/b86f35a7b980c48976671094d89bef622b48b658))
* add _validPair, _validKey ([6b2507b](https://github.com/bluelovers/sd-wildcards-utils/commit/6b2507b74f82be616ebb732ca563f578175b43d1))


### 📦　Code Refactoring

* better error message ([c73cc2f](https://github.com/bluelovers/sd-wildcards-utils/commit/c73cc2ffa0ad451d33229f0aa3bfa2d8d2ea234c))
* _visitNormalizeScalar ([f1ba91b](https://github.com/bluelovers/sd-wildcards-utils/commit/f1ba91b94cebbf968e01d79e7fe4b0d00d6efe2e))


### 🛠　Build System

* update build ([92e407e](https://github.com/bluelovers/sd-wildcards-utils/commit/92e407e978805925c900c4dfb9a53d812f1a6e48))


### 📌　Dependencies

* update deps ([de9dd57](https://github.com/bluelovers/sd-wildcards-utils/commit/de9dd573eb7279b13e3201647242a82c424f9693))


### 🔖　Miscellaneous

* . ([106187c](https://github.com/bluelovers/sd-wildcards-utils/commit/106187cd560d5fe6013770d28c5a8cb4ceb84ce7))
* **wildcards:** lazy-wildcards@v1.0.3 ([ab1298b](https://github.com/bluelovers/sd-wildcards-utils/commit/ab1298bd0181203f296ef536c2d8aeb8dbefa092))



## [1.0.27](https://github.com/bluelovers/sd-wildcards-utils/compare/sd-wildcards-utils@1.0.26...sd-wildcards-utils@1.0.27) (2024-06-07)



### 🛠　Build System

* update build ([4befd5b](https://github.com/bluelovers/sd-wildcards-utils/commit/4befd5b74a3238292013dd91d53b3a16a7140fbd))



## [1.0.26](https://github.com/bluelovers/sd-wildcards-utils/compare/sd-wildcards-utils@1.0.25...sd-wildcards-utils@1.0.26) (2024-06-05)



### 🛠　Build System

* update build ([8c4e76e](https://github.com/bluelovers/sd-wildcards-utils/commit/8c4e76e6dce20747621a515b8513e079c58a9508))


### 🔖　Miscellaneous

* . ([366a5a3](https://github.com/bluelovers/sd-wildcards-utils/commit/366a5a33f5425fa152fada7a8db119ed07aa8d04))



## [1.0.25](https://github.com/bluelovers/sd-wildcards-utils/compare/sd-wildcards-utils@1.0.24...sd-wildcards-utils@1.0.25) (2024-06-05)

**Note:** Version bump only for package sd-wildcards-utils





## [1.0.24](https://github.com/bluelovers/sd-wildcards-utils/compare/sd-wildcards-utils@1.0.23...sd-wildcards-utils@1.0.24) (2024-06-05)



### 🛠　Build System

* update build ([3a3ce0b](https://github.com/bluelovers/sd-wildcards-utils/commit/3a3ce0b21085cd226039584b61e5058f80dde491))



## [1.0.23](https://github.com/bluelovers/sd-wildcards-utils/compare/sd-wildcards-utils@1.0.22...sd-wildcards-utils@1.0.23) (2024-06-05)



### ✨　Features

* **format:** strip `,` ([22ac073](https://github.com/bluelovers/sd-wildcards-utils/commit/22ac0736da031780ccdaf19b5ec69264e3a2bbdb))
* **wildcards:** . ([255eb05](https://github.com/bluelovers/sd-wildcards-utils/commit/255eb05a42806ae29561b239fac321ecfdaf19c0))
* **wildcards:** add `NeoFalmerWorld` ([65b2acd](https://github.com/bluelovers/sd-wildcards-utils/commit/65b2acded67e03738387687bec7f2fff988a1670))
* **wildcards:** add `sunvibebdsm` ([3a3b992](https://github.com/bluelovers/sd-wildcards-utils/commit/3a3b992a53affba7eed02f025abb6bb601894a70))


### 📦　Code Refactoring

* **wildcards:** splitting wildcards ([f97fe34](https://github.com/bluelovers/sd-wildcards-utils/commit/f97fe342ffbcc7ca33d1622bcb769c4dbeae5568))


### 🔖　Miscellaneous

* . ([e0db9c5](https://github.com/bluelovers/sd-wildcards-utils/commit/e0db9c5118f9e22b0a3b7d6199b319b89fce0597))



## [1.0.22](https://github.com/bluelovers/sd-wildcards-utils/compare/sd-wildcards-utils@1.0.21...sd-wildcards-utils@1.0.22) (2024-06-03)



### 🛠　Build System

* update build ([ba3867a](https://github.com/bluelovers/sd-wildcards-utils/commit/ba3867a8e2c758eee063c3e89d19dc7c4b7a6930))



## [1.0.21](https://github.com/bluelovers/sd-wildcards-utils/compare/sd-wildcards-utils@1.0.20...sd-wildcards-utils@1.0.21) (2024-06-03)



### ✨　Features

* add `findWildcardsYAMLPathsAll` ([0498f0d](https://github.com/bluelovers/sd-wildcards-utils/commit/0498f0d72457042a5cfe3b1695b83d212fae83c8))
* **wildcards:** add `toilet-dirty` ([f34e9ee](https://github.com/bluelovers/sd-wildcards-utils/commit/f34e9eea73daa4de6c4017049abedec702c5ca78))
* **wildcards:** add `pulp magazine` ([3b0418a](https://github.com/bluelovers/sd-wildcards-utils/commit/3b0418a889ecd67437957dfd274d91494de62744))


### 📦　Code Refactoring

* rename to `action-nsfw-sex` ([5b3c949](https://github.com/bluelovers/sd-wildcards-utils/commit/5b3c9490d35b371837d00378b487747decaf2f17))
* splitting wildcards ([440e950](https://github.com/bluelovers/sd-wildcards-utils/commit/440e950e3ac00f046e47bad6e0a1b160b6d5a1a7))


### ♻️　Chores

* add others ([9912f22](https://github.com/bluelovers/sd-wildcards-utils/commit/9912f2219fd81a671bda951b3cf08dd253daa683))



## [1.0.20](https://github.com/bluelovers/sd-wildcards-utils/compare/sd-wildcards-utils@1.0.19...sd-wildcards-utils@1.0.20) (2024-06-01)



### ✨　Features

* handleVisitPathsFull ([92c1cbd](https://github.com/bluelovers/sd-wildcards-utils/commit/92c1cbdf9584d7a492e46efc3249817e5c9b01c6))
* handleVisitPaths ([975add4](https://github.com/bluelovers/sd-wildcards-utils/commit/975add442dd5a8b9442cbda5f007cc86b32c19ef))


### 🛠　Build System

* update build ([94deed1](https://github.com/bluelovers/sd-wildcards-utils/commit/94deed13d4ae4dc150398b41975bdb8481dd984d))



## [1.0.19](https://github.com/bluelovers/sd-wildcards-utils/compare/sd-wildcards-utils@1.0.18...sd-wildcards-utils@1.0.19) (2024-06-01)



### ✨　Features

* add `mergeFindSingleRoots` for lazy merge ([c164735](https://github.com/bluelovers/sd-wildcards-utils/commit/c16473585a687a5f959524fc36551b59600067f8))


### 📦　Code Refactoring

* splitting wildcards ([38501e2](https://github.com/bluelovers/sd-wildcards-utils/commit/38501e2da6ef4b4b3b88c831383d13ed026b2f51))


### 🔖　Miscellaneous

* . ([3ac4156](https://github.com/bluelovers/sd-wildcards-utils/commit/3ac41561dd9dcfa104500df35a5768a1bd9548ce))



## [1.0.18](https://github.com/bluelovers/sd-wildcards-utils/compare/sd-wildcards-utils@1.0.17...sd-wildcards-utils@1.0.18) (2024-05-30)



### 🛠　Build System

* update build ([a7a947d](https://github.com/bluelovers/sd-wildcards-utils/commit/a7a947d1d93a42af6c79e2b30af5870d52a09960))



## [1.0.17](https://github.com/bluelovers/sd-wildcards-utils/compare/sd-wildcards-utils@1.0.16...sd-wildcards-utils@1.0.17) (2024-05-30)



### 🐛　Bug Fixes

* only minify `,` ([0221426](https://github.com/bluelovers/sd-wildcards-utils/commit/02214260450beb7a69655f6eeb5b485f803aab45))


### ✨　Features

* add `isStarWildcards` ([3df01bb](https://github.com/bluelovers/sd-wildcards-utils/commit/3df01bbbc7b12d9d2156658c9fb46be8947414e8))
* **options:** `allowEmptyDocument`, `minifyPrompts` ([4c86a20](https://github.com/bluelovers/sd-wildcards-utils/commit/4c86a2058df5f952ecee40b6be54e2159924fd02))


### 🚨　Tests

* add cache used wildcards ([f71a389](https://github.com/bluelovers/sd-wildcards-utils/commit/f71a3899f8d0b567f05147ed9ddd2accffdd7ed8))
* update test ([e1c3936](https://github.com/bluelovers/sd-wildcards-utils/commit/e1c39360d588bf3f294f715231eb86fba709e1d6))


### 🛠　Build System

* update build ([821c85a](https://github.com/bluelovers/sd-wildcards-utils/commit/821c85a859368976189093ba2147eb0a7c88b071))


### ♻️　Chores

* add city-traffic , nsfw-sex-sitting ([2c5c044](https://github.com/bluelovers/sd-wildcards-utils/commit/2c5c0440ef8b2051b47f26b8d4ce20b453f5a5b7))


### 🔖　Miscellaneous

* **node:** update types ([6f96899](https://github.com/bluelovers/sd-wildcards-utils/commit/6f96899157bbf1314de01b1c06b1b08ef3de454b))



## [1.0.16](https://github.com/bluelovers/sd-wildcards-utils/compare/sd-wildcards-utils@1.0.15...sd-wildcards-utils@1.0.16) (2024-05-29)

**Note:** Version bump only for package sd-wildcards-utils





## [1.0.15](https://github.com/bluelovers/sd-wildcards-utils/compare/sd-wildcards-utils@1.0.14...sd-wildcards-utils@1.0.15) (2024-05-29)


### BREAKING CHANGES

* update findPath to new style



### 📦　Code Refactoring

* update findPath to new style ([df5a566](https://github.com/bluelovers/sd-wildcards-utils/commit/df5a566bcc3d537311beb9c35e994421209ff78f))
* findPath ([b02b349](https://github.com/bluelovers/sd-wildcards-utils/commit/b02b3499266ed410e1dc6526bbe663cb1a45d410))


### ⚙️　Continuous Integration

* fix for new cf wildcards ([1c3cb39](https://github.com/bluelovers/sd-wildcards-utils/commit/1c3cb3983135f411bc89f45a4a01d737a8591f58))


### ♻️　Chores

* add `__lazy-wildcards/subject/action/nsfw-*/prompts__` ([93d7d76](https://github.com/bluelovers/sd-wildcards-utils/commit/93d7d76204a9b9eaae8982c201e9451f00bd200d))



## [1.0.14](https://github.com/bluelovers/sd-wildcards-utils/compare/sd-wildcards-utils@1.0.13...sd-wildcards-utils@1.0.14) (2024-05-29)

**Note:** Version bump only for package sd-wildcards-utils





## [1.0.13](https://github.com/bluelovers/sd-wildcards-utils/compare/sd-wildcards-utils@1.0.12...sd-wildcards-utils@1.0.13) (2024-05-29)



### 🛠　Build System

* update build ([45d5085](https://github.com/bluelovers/sd-wildcards-utils/commit/45d5085286b957975af2a90a977612ebedfbc024))



## [1.0.12](https://github.com/bluelovers/sd-wildcards-utils/compare/sd-wildcards-utils@1.0.11...sd-wildcards-utils@1.0.12) (2024-05-29)



### ✨　Features

* allow disable check UnsafeQuote ([089583b](https://github.com/bluelovers/sd-wildcards-utils/commit/089583b7929d346d2245b44e16ad7c8be6f2cd9d))



## [1.0.11](https://github.com/bluelovers/sd-wildcards-utils/compare/sd-wildcards-utils@1.0.10...sd-wildcards-utils@1.0.11) (2024-05-28)

**Note:** Version bump only for package sd-wildcards-utils





## [1.0.10](https://github.com/bluelovers/sd-wildcards-utils/compare/sd-wildcards-utils@1.0.9...sd-wildcards-utils@1.0.10) (2024-05-28)

**Note:** Version bump only for package sd-wildcards-utils





## [1.0.9](https://github.com/bluelovers/sd-wildcards-utils/compare/sd-wildcards-utils@1.0.8...sd-wildcards-utils@1.0.9) (2024-05-28)

**Note:** Version bump only for package sd-wildcards-utils





## [1.0.8](https://github.com/bluelovers/sd-wildcards-utils/compare/sd-wildcards-utils@1.0.7...sd-wildcards-utils@1.0.8) (2024-05-28)



### ✨　Features

* add merge utils ([024ba79](https://github.com/bluelovers/sd-wildcards-utils/commit/024ba799d7c3092d4bc7495c66a035d1c36821c7))



## [1.0.7](https://github.com/bluelovers/sd-wildcards-utils/compare/sd-wildcards-utils@1.0.6...sd-wildcards-utils@1.0.7) (2024-05-28)



### ✨　Features

* add defaultCheckerIgnoreCase ([26cacf1](https://github.com/bluelovers/sd-wildcards-utils/commit/26cacf1d172403420782b0af71ab9ba0e549a030))
* support new `cf-model` ([a22344d](https://github.com/bluelovers/sd-wildcards-utils/commit/a22344d62f698ac3fb5cf7923953bcc98f6b132a))


### 📦　Code Refactoring

* add `_validSeq` ([27ecef1](https://github.com/bluelovers/sd-wildcards-utils/commit/27ecef13e0d9e795ad763975449ca2da8255b5b2))
* code splitting ([5b34f60](https://github.com/bluelovers/sd-wildcards-utils/commit/5b34f60abe9f68010b6bc9458eea888f6b5c510a))


### ⚙️　Continuous Integration

* COMMIT_NAME ([1b831cb](https://github.com/bluelovers/sd-wildcards-utils/commit/1b831cb14e91cd1ad593fd4f9e1a571dea6ca95c))


### 🔖　Miscellaneous

* . ([6f136d7](https://github.com/bluelovers/sd-wildcards-utils/commit/6f136d7e8119b49f20826c76779cba590d53510c))



## [1.0.6](https://github.com/bluelovers/sd-wildcards-utils/compare/sd-wildcards-utils@1.0.5...sd-wildcards-utils@1.0.6) (2024-05-25)



### 📚　Documentation

* update readme and types ([76c5121](https://github.com/bluelovers/sd-wildcards-utils/commit/76c512162bc5d9022e10334ad53f25438744036e))



## [1.0.5](https://github.com/bluelovers/sd-wildcards-utils/compare/sd-wildcards-utils@1.0.4...sd-wildcards-utils@1.0.5) (2024-05-25)



### 🛠　Build System

* update build ([2c9001f](https://github.com/bluelovers/sd-wildcards-utils/commit/2c9001f3052ee10774607095dffe4c40b934778d))



## [1.0.4](https://github.com/bluelovers/sd-wildcards-utils/compare/sd-wildcards-utils@1.0.3...sd-wildcards-utils@1.0.4) (2024-05-25)

**Note:** Version bump only for package sd-wildcards-utils





## [1.0.3](https://github.com/bluelovers/sd-wildcards-utils/compare/sd-wildcards-utils@1.0.2...sd-wildcards-utils@1.0.3) (2024-05-25)



### 🐛　Bug Fixes

* support scope ([04baf64](https://github.com/bluelovers/sd-wildcards-utils/commit/04baf64ebf7725a2c7c8209922c7e15997bbcab1))
* **wildcards:** color-theme-multi ([62959dd](https://github.com/bluelovers/sd-wildcards-utils/commit/62959dd57619e86be951ed2b9a66702e240a5b3c))
* **wildcards:** breasts ([6e348e6](https://github.com/bluelovers/sd-wildcards-utils/commit/6e348e60c642af92a9bd986e21cbaa4dfa2b14bd))


### ✨　Features

* **wildcards:** disable lineWidth ([fa66d97](https://github.com/bluelovers/sd-wildcards-utils/commit/fa66d97aa32dbe100ea1e5eac0f9d37991651f83))
* **wildcards:** merge mix-lazy-auto.yaml into lazy-wildcards.yaml ([17820e9](https://github.com/bluelovers/sd-wildcards-utils/commit/17820e9cac7e8f621d4aeff4cca0e90750aa449f))


### 📦　Code Refactoring

* add many change and new ([cd6e8fa](https://github.com/bluelovers/sd-wildcards-utils/commit/cd6e8faa292a6b830ca49b48d66181846cc1b566))
* **wildcards:** __lazy-wildcards/background/location/*/prompts__ ([6027b79](https://github.com/bluelovers/sd-wildcards-utils/commit/6027b794bc752ef2b27f8b19fb5bf12fec22062c))


### 📚　Documentation

* **wildcards:** update readme ([a764bdf](https://github.com/bluelovers/sd-wildcards-utils/commit/a764bdf2d9c9229cf1bede690fc64ecf103ba9e0))


### 🛠　Build System

* update build ([ce48d97](https://github.com/bluelovers/sd-wildcards-utils/commit/ce48d97b5394f604eaa7e0e61a92c45813079cb0))
* update build ([63b1302](https://github.com/bluelovers/sd-wildcards-utils/commit/63b13029f98e983e28493444fe5b01c85b1ec016))
* update build ([f1151be](https://github.com/bluelovers/sd-wildcards-utils/commit/f1151bea58163f5e39c5c61823daaa9aa77e5725))


### ⚙️　Continuous Integration

* try use token ([51372a8](https://github.com/bluelovers/sd-wildcards-utils/commit/51372a80d888d4fafc82ec747c0199d482cbafc0))
* **fix:** fetch submodules, info of merge ([36572cb](https://github.com/bluelovers/sd-wildcards-utils/commit/36572cb7b827f45c214f2d63dcd668a84024a5ba))


### ♻️　Chores

* **wildcards:** update wildcards ([2efc24e](https://github.com/bluelovers/sd-wildcards-utils/commit/2efc24e57814ee2a15f8db137b25d35288bde7d6))
* **wildcards:** add silhouette ([7be04ae](https://github.com/bluelovers/sd-wildcards-utils/commit/7be04aed4698b73df8e0990c5f7a211711ebe531))



## [1.0.2](https://github.com/bluelovers/sd-wildcards-utils/compare/sd-wildcards-utils@1.0.1...sd-wildcards-utils@1.0.2) (2024-05-22)



### 🐛　Bug Fixes

* couldn't find remote ref master ([4903eb3](https://github.com/bluelovers/sd-wildcards-utils/commit/4903eb371ce7d75d65096af3428c2dd1e1d63222))


### 🛠　Build System

* update build ([ae2f3e5](https://github.com/bluelovers/sd-wildcards-utils/commit/ae2f3e5fb9a70292d1d9f2040154bcff81756db5))
* update build ([1ced540](https://github.com/bluelovers/sd-wildcards-utils/commit/1ced540794375e51213cdff71320f44057492af5))
* update build ([95670c3](https://github.com/bluelovers/sd-wildcards-utils/commit/95670c37f6d21f8da69dd03fa9ebe333b5115097))
* add build scripts ([d46e5dd](https://github.com/bluelovers/sd-wildcards-utils/commit/d46e5dd9284b336f0b0b75b64b967b6f5d2905a3))


### ⚙️　Continuous Integration

* update ci ([9e507e7](https://github.com/bluelovers/sd-wildcards-utils/commit/9e507e7093c16de9d34925a307e85187bce7b238))
* update ci ([63e7d22](https://github.com/bluelovers/sd-wildcards-utils/commit/63e7d22a9763e37c3e0dc69f66bfde3da2cdf798))
* update ci ([d7ece6d](https://github.com/bluelovers/sd-wildcards-utils/commit/d7ece6d55201f3407eb42d4451d30ac35ba436a9))
* update ci ([4d10640](https://github.com/bluelovers/sd-wildcards-utils/commit/4d10640b4cae8bd42315c31f41b590693fbc8dde))
* update ci ([ddcc829](https://github.com/bluelovers/sd-wildcards-utils/commit/ddcc8297c245c9a6665befb19d1c4c7184784371))



## 1.0.1 (2024-05-22)



### 🐛　Bug Fixes

* allow change options ([f946273](https://github.com/bluelovers/sd-wildcards-utils/commit/f9462733b2b9beaf90be9899787479e4c5dd99e3))


### ✨　Features

* add utils ([17aa9d3](https://github.com/bluelovers/sd-wildcards-utils/commit/17aa9d3182791086f66c1ab541469f047ae30f4a))


### 📦　Code Refactoring

* move file ([879e2f9](https://github.com/bluelovers/sd-wildcards-utils/commit/879e2f9bb4de31ace2105f570d358d14ab04bd17))


### 🛠　Build System

* update build ([cf41827](https://github.com/bluelovers/sd-wildcards-utils/commit/cf41827895674834bf1e4715943ea965bc653669))
* update build ([0935c96](https://github.com/bluelovers/sd-wildcards-utils/commit/0935c96e96d7405618bdaa5786e00e064f99b77e))
* update build ([c71fecc](https://github.com/bluelovers/sd-wildcards-utils/commit/c71fecc086135f825f74c5b1de1dbb178cba063f))
* static wildcards files ([baf374a](https://github.com/bluelovers/sd-wildcards-utils/commit/baf374ac26a03987a98c3446cbae68e4724172b1))
* update build ([07fc388](https://github.com/bluelovers/sd-wildcards-utils/commit/07fc388704b866f427a40521af7d6de66ad4f0b1))
* update build ([f4a697b](https://github.com/bluelovers/sd-wildcards-utils/commit/f4a697b20dcc45186a252a0a0028b401925eb735))


### ♻️　Chores

* add `raised eyebrows` ([2ec5b22](https://github.com/bluelovers/sd-wildcards-utils/commit/2ec5b22f01e711bde65bcf42ff417a3df428a69f))
* wildcards files ([d78adf6](https://github.com/bluelovers/sd-wildcards-utils/commit/d78adf6252379595d6fae9501c7af44b7770443a))


### 🔖　Miscellaneous

* sd-wildcards-utils ([21c4296](https://github.com/bluelovers/sd-wildcards-utils/commit/21c42964a2d165adeeaf4519e545524a2085a554))
* -hash- ([](https://github.com/bluelovers/sd-wildcards-utils/commit/))
* -hash- ([](https://github.com/bluelovers/sd-wildcards-utils/commit/))
* -hash- ([](https://github.com/bluelovers/sd-wildcards-utils/commit/))
* -hash- ([](https://github.com/bluelovers/sd-wildcards-utils/commit/))
* -hash- ([](https://github.com/bluelovers/sd-wildcards-utils/commit/))
* -hash- ([](https://github.com/bluelovers/sd-wildcards-utils/commit/))
* -hash- ([](https://github.com/bluelovers/sd-wildcards-utils/commit/))
* -hash- ([](https://github.com/bluelovers/sd-wildcards-utils/commit/))
* -hash- ([](https://github.com/bluelovers/sd-wildcards-utils/commit/))
* -hash- ([](https://github.com/bluelovers/sd-wildcards-utils/commit/))
* -hash- ([](https://github.com/bluelovers/sd-wildcards-utils/commit/))
