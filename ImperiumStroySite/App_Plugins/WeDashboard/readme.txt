Инструкция для установки:
1. Откройте файл "config/Dashboard.config"
2. Добавьте внутрь узла <section alias="StartupDashboardSection"> следующие блоки:

<tab caption="Добро пожаловать">
	<control showOnce="true" addPanel="true" panelCaption="">
		~/App_Plugins/WeDashboard/Welcome.html
	</control>
</tab>

<tab caption="Инструкция">
	<control showOnce="true" addPanel="true" panelCaption="">
		~/App_Plugins/WeDashboard/Instructions.html
	</control>
</tab>

3. Убедитесь, что по указанным в блоках путях есть соответствующие HTML-файлы.
