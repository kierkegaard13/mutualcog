<?php

class Scripts extends BaseController {

	public function getClassgen(){
		function capFirst (&$item,$property) {
			$item = ucfirst($item);
		}
		$class_dir = '/var/www/laravel/app/models';
		$prop = 'Tables_in_test';
		$tables = DB::select("SHOW TABLES");
		foreach ($tables as $table) {
			$parts = explode('_',$table->$prop);
			array_walk($parts,'capFirst');
			$db_class_name = implode('',$parts);
			$db_class_text = '<?php

class '.$db_class_name.' extends EloquentBridge 
{
	protected $table = "'.$table->$prop.'";

}';
			$db_class_filepath = $class_dir . '/' . $db_class_name . '.php';
			$i = 0;
			if(!file_exists($db_class_filepath)){
				$fh = fopen($db_class_filepath,'w');
				if (-1 == fwrite($fh,$db_class_text)) {
					die("no go write $db_class_filepath");
				}
				fclose($fh) or die("no go close");
				chmod($db_class_filepath,0664);
				print "created $db_class_name\n";
			}
		}
	}
}

